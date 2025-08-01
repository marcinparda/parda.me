---
title: How I Reduced My Monorepo Deployment Time from 20+ Minutes to Under 10 — and Made It Reliable
pubDate: 2025-08-01
tags: [deployment, docker, nx, raspberrypi, github-actions]
---

Deploying multiple frontend apps from a monorepo to a Raspberry Pi can be slow, error-prone, and frustrating—especially when you’re dealing with flaky SSH connections and Docker builds on limited hardware. In this post, I’ll walk you through how I transformed my deployment process from a 20+ minute headache (with frequent failures) to a fast, reliable, and maintainable workflow that takes just 5–10 minutes. I’ll share the real code and workflows from this repository, so you can adapt the approach to your own projects.

#### Disclaimer

I have only some experience with deployment — this is not my main expertise as a developer, not even a second one. There may be better solutions to this problem, especially regarding how to connect to a Raspberry Pi, but I wanted a workflow that would be cheap or free and that I would understand. Along the way, I hoped to learn a thing or two. I also haven’t tested this solution for deploying metaframeworks with their own backend server (like Next.js or Nuxt), but I have ideas for that and want to explore it in the future. If you want to see the solution, check the code and the READMEs in this repo, which describe the project and how to use it. This post is my journey to achieving this solution and a breakdown of every problem I encountered.

For the full code and workflows, see the [nx-docker-rpi-deployment repo](https://github.com/marcinparda/nx-docker-rpi-deployment).

### Table of Contents

1. [Background & Goals](#background--goals)
2. [The Old Way: Painful Deployments](#the-old-way-painful-deployments)
3. [Key Problems with NX & Docker](#key-problems-with-nx--docker)
4. [The Solution: Fast, Reliable Deployments](#the-solution-fast-reliable-deployments)
   - [GitHub Container Registry](#github-container-registry)
   - [NX Affected Checks](#nx-affected-checks)
   - [Smarter GitHub Workflows](#smarter-github-workflows)
   - [Building Only What’s Needed](#building-only-whats-needed)
5. [Further Improvements](#further-improvements)
6. [Summary](#summary)
7. [Flashcard](#flashcard)

---

### Background & Goals

#### My Goals

- Deploy only the apps from my NX monorepo that changed since the last successful deployment (using `nx affected`).
- Deploy to my Raspberry Pi via Docker and Cloudflare Tunnel, with minimal dependencies on the Pi itself.
- Get meaningful logging and short SSH connections (to avoid disconnects during long builds).
- Make it easy to add new apps to the deployment.
- Avoid managing code or node/npm dependencies on the Raspberry Pi.
- Simplify environment file management.

#### What I Started With

- A single, messy GitHub workflow file I barely understood.
- SSHing into the Pi via Cloudflare Tunnel (not covered here).
- The Pi had a repo clone and Docker installed. The workflow SSHed in, ran `docker compose down`, `build`, and `up`—which was slow and often failed due to connection drops.
- Every deployment rebuilt all apps and Docker images, even if only one changed. NX and Docker didn’t play well together, so I couldn’t easily build just the affected apps.

---

### The Old Way: Painful Deployments

NX doesn’t provide much examples for deploying apps, especially with Docker. I can't blame the NX team tho, every project is different, but I expected whole process to be easier. My first approach was to install NX and npm in each Docker image, then build only the app for that image. But if I had 10 shared libs, they’d be rebuilt in every image—wasting time and resources. SSH operations and Docker builds on the Pi were slow and unreliable. I needed a better way.

---

### Key Problems with NX & Docker

- **NX affected** is great for building only what changed, but running it inside Docker is slow and requires node/npm/NX in every image.
- Docker images for each app would redundantly build shared libs, multiplying build time.
- SSH connections to the Pi were unstable, so long builds often failed at the last minute.
- There was no easy way to add new apps or manage environments.

---

### The Solution: Fast, Reliable Deployments

#### 1. GitHub Container Registry

Instead of building Docker images on the Pi, I started building them in GitHub Actions and pushing them to [GitHub Container Registry (GHCR)](https://ghcr.io/). Now, the Pi just pulls the latest images—no more code or node/npm on the device, and no more long builds over SSH.

#### 2. NX Affected Checks

To make sure only changed projects are built, I first get the last successful deploy commit SHA in the workflow. This is done by searching the workflow history for the last successful run and extracting its commit hash:

```bash
gh run list \
  --workflow="Deploy" \
  --branch=${{ github.ref_name }} \
  --status=success \
  --json headSha \
  --limit 1 > result.json

LAST_SUCCESSFUL_SHA=$(jq -r '.[0].headSha // empty' result.json)
```

If no successful run is found, it falls back to the latest commit on `main`. With this SHA, I use `nx affected` to lint, test, and build only the projects that changed since the last successful deployment. Here’s the key command:

```bash
npx nx affected --targets=lint,build,test --base=$LAST_SUCCESSFUL_SHA --head=HEAD --parallel=4
```

This runs in the GitHub Actions workflow, not on the Pi. It’s fast and only touches what’s needed.

#### Simplified Dockerfiles

With builds happening in GitHub Actions, I was able to greatly simplify my Dockerfiles. Instead of installing Node, npm, and all dependencies inside each Docker image, the Dockerfiles now only copy the already built files and the nginx config. This makes the images smaller, the build process much faster, and removes the need for any extra dependencies in the image. Here’s what a typical Dockerfile looks like now:

```dockerfile
FROM nginx:alpine

# Copy built files for the app
COPY dist/apps/app-1 /usr/share/nginx/html

# Copy custom nginx config
COPY apps/app-1/nginx/app-1.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

No more installing packages or running builds inside Docker—just copy the output and serve it with nginx.

#### 3. Smarter GitHub Workflows

The deployment is split into two main workflows:

- **`deploy.yml`**: Builds and pushes Docker images for only the affected apps.
- **`deploy-to-production.yml`**: Connects to the Pi via Cloudflare Tunnel and runs a deployment script that pulls and runs the latest images.

**Example: Only Build and Push If Output Exists**

```yaml
- name: Check if app-1 build output exists
  id: app_1_exists
  run: |
    if [ -d "dist/apps/app-1" ]; then
      echo "exists=true" >> $GITHUB_OUTPUT
    else
      echo "exists=false" >> $GITHUB_OUTPUT
    fi

- name: Build and push Docker image for app-1
  if: steps.app_1_exists.outputs.exists == 'true'
  uses: docker/build-push-action@v6
  with:
    context: .
    file: apps/app-1/Dockerfile
    push: true
    tags: |
      ghcr.io/${{ github.repository }}-app-1:latest
      ghcr.io/${{ github.repository }}-app-1:${{ github.sha }}
    platforms: linux/arm64
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

This ensures we only build and push images for apps that were actually built (affected by recent changes).

#### 4. Building Only What’s Needed

By checking for the existence of build output for each app, the workflow only builds and pushes Docker images for those apps. No more wasted time on unaffected projects.

---

### Further Improvements

- **`deploy.sh` Script**: Handles pulling and running the latest images on the Pi. It’s copied and executed remotely by the workflow. Using a shell script here makes it much easier to create loops (for example, iterating over all apps and their ports) and to change the deployment logic, compared to doing this directly in a `.yml` workflow file. This keeps the workflow file clean and lets you use all the flexibility of bash scripting for deployment steps.

```bash
#!/bin/bash
set -e

# ...existing code...
for app in "${!apps[@]}"; do
  port="${apps[$app]}"
  image="ghcr.io/$OWNER/$REPO-$app:latest"
  container="$app"

  docker stop "$container" 2>/dev/null || true
  docker rm "$container" 2>/dev/null || true
  docker image prune -a -f
  docker pull "$image"
  docker run -d --name "$container" --restart unless-stopped -p "$port:80" "$image"
  # Health check
  sleep 5
  if docker ps --filter "name=$container" --filter "status=running" | grep -q "$container"; then
    echo "$container is running successfully"
  else
    echo "$container failed to start"
    docker logs "$container"
    exit 1
  fi
  # ...existing code...
done
```

- **Documentation**: Now github workflows had its README, and the main repo README explains the deployment process.
- **Split Workflows**: Separate files for building/pushing and for production deployment keep things clean.
- **NX --parallel**: Using `--parallel=4` speeds up builds and tests, but requires more CPU resources in the GitHub Actions runner.
- **Targeted Architectures**: Images are built for `linux/arm64` (for the Pi), not for `linux/amd64` and `linux/arm64` to speed the process, but you can adjust as needed.

---

### Summary

By moving builds to GitHub Actions, using `nx affected` to target only changed projects, and deploying with Docker images from GHCR, I cut my deployment time by more than half and made failures rare. The process is now fast, reliable, and easy to extend for new apps.

**Here’s an addon for you.** A flashcard about one of the topics discussed in this post.

### Flashcard

**Q:** Why do NX affected and Docker have problems when used together for monorepo deployments?

**A:** Running builds in Docker is slow, requires node/npm/NX in every image, and causes shared libs to be rebuilt in every image—wasting time and resources. Building outside Docker with `nx affected` and only pushing needed images is much faster and more efficient.

---

For the full code and workflows, see the [nx-docker-rpi-deployment repo](https://github.com/marcinparda/nx-docker-rpi-deployment).
