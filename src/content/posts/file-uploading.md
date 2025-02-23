---
title: "Uploading a file in React"
pubDate: 2025-02-23
tags: ["react", "AbortController"]
---

## Problem

Implementing a basic file upload feature in React seems straightforward - until you need to handle complex requirements like upload cancellation, progress tracking, and error handling. Let's examine a common naive implementation:

```tsx
function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="submit" disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
```

This implementation works for basic scenarios but lacks critical features:

- No way to cancel ongoing uploads
- No progress feedback
- Limited error handling
- State management could be improved

## Solution

### Basic File Upload Implementation

Let's first create a mock API client to simulate network behavior:

```tsx
const mockUpload = (file: File) =>
  new Promise((resolve) => setTimeout(() => resolve({ status: 200 }), 2000));
```

Now we can use it and implement some improvements like consolidated state management, error handling, disabled UI during upload, better typing:

```tsx
interface UploadState {
  file: File | null;
  loading: boolean;
  error: string | null;
}

function FileUploader() {
  const [state, setState] = useState<UploadState>({
    file: null,
    loading: false,
    error: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.file) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const formData = new FormData();
      formData.append("file", state.file);

      await mockUpload(state.file);
    } catch (error) {
      setState((prev) => ({ ...prev, error: "Upload failed" }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            file: e.target.files?.[0] || null,
          }))
        }
      />
      <button type="submit" disabled={!state.file || state.loading}>
        {state.loading ? "Uploading..." : "Upload"}
      </button>
      {state.error && <div>{state.error}</div>}
    </form>
  );
}
```

### Aborting File Uploads

Now when we have everything set up, let's add the ability to cancel ongoing uploads if the user changes their mind or missclick. We can use the AbortController API for this:

```tsx
interface UploadState {
  file: File | null;
  loading: boolean;
  error: string | null;
  controller?: AbortController;
}

function FileUploader() {
  const [state, setState] = useState<UploadState>({
    file: null,
    loading: false,
    error: null,
  });

  const handleAbort = () => {
    state.controller?.abort();
    setState((prev) => ({
      ...prev,
      loading: false,
      controller: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.file) return;

    const controller = new AbortController();
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      controller,
    }));

    try {
      const formData = new FormData();
      formData.append("file", state.file);

      await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        setState((prev) => ({ ...prev, error: "Upload failed" }));
      }
    } finally {
      setState((prev) =>
        prev.controller === controller
          ? {
              ...prev,
              loading: false,
              controller: undefined,
            }
          : prev,
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* File input remains same */}
      {state.loading ? (
        <button type="button" onClick={handleAbort}>
          Cancel Upload
        </button>
      ) : (
        <button type="submit" disabled={!state.file}>
          Upload
        </button>
      )}
    </form>
  );
}
```

For canceling the upload, we added a new button that calls the `handleAbort` function. This function aborts the ongoing request using the `AbortController` instance and resets the component state.
`AbortController` is a built-in API that allows canceling fetch requests and other asynchronous operations so it fits perfectly here.

### Tracking Upload Progress

Now, let's implement progress tracking. We'll modify our mock API to support progress reporting with a callback `onProgress` function:

```tsx
const mockProgressUpload = (file: File, onProgress: (p: number) => void) => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      onProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        resolve({ status: 200 });
      }
    }, 500);
  });
};
```

Now `mockProgressUpload` is given a callback function `onProgress` that is called with the current progress percentage. Let's update our component to use this new API and visualize the progress:

```tsx
interface UploadState {
  file: File | null;
  loading: boolean;
  error: string | null;
  progress: number;
  controller?: AbortController;
}

function FileUploader() {
  const [state, setState] = useState<UploadState>({
    file: null,
    loading: false,
    error: null,
    progress: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.file) return;

    const controller = new AbortController();
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      progress: 0,
      controller,
    }));

    try {
      await mockProgressUpload(state.file, (progress) => {
        setState((prev) => ({
          ...prev,
          progress,
        }));
      });
    } catch (error) {
      // Error handling same as before
    } finally {
      // Cleanup same as before
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* File input remains same */}
      {state.loading && (
        <div>
          <progress value={state.progress} max="100" />
          <span>{state.progress}%</span>
        </div>
      )}
      {/* Buttons remain same */}
    </form>
  );
}
```

We added here a progress bar and a percentage label that updates in real-time as the upload progresses. The `mockProgressUpload` function simulates the progress by increasing it every 500ms until it reaches 100%. The `onProgress` callback is called with the current progress value, which we use to update the component state.
Now progress tracking is fully functional, and the user can see the upload progress in real-time.

## Summary

We've implemented a robust file upload component with:

- Basic file upload functionality
- Upload cancellation using AbortController
- Progress tracking with visual feedback
- Error handling and state management

Key takeaways:

- Always clean up ongoing requests when unmounting
- Use AbortController for request cancellation
- Consider using dedicated libraries for complex file handling
- Progress tracking requires backend support or mock implementation

Refactored code:

```tsx
import { useCallback, useRef, useState } from "react";

interface UploadState {
  file: File | null;
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  error: string | null;
  controller?: AbortController;
}

const mockProgressUpload = (file: File, onProgress: (p: number) => void) => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      onProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        resolve({ status: 200 });
      }
    }, 500);
  });
};

const useFileUpload = () => {
  const [state, setState] = useState<UploadState>({
    file: null,
    status: "idle",
    progress: 0,
    error: null,
  });

  const handleAbort = useCallback(() => {
    state.controller?.abort();
    setState((prev) => ({
      ...prev,
      status: "idle",
      controller: undefined,
      progress: 0,
    }));
  }, [state.controller]);

  const handleSubmit = useCallback(async (file: File) => {
    const controller = new AbortController();

    setState({
      file,
      status: "uploading",
      progress: 0,
      error: null,
      controller,
    });

    try {
      await mockProgressUpload(file, (progress) => {
        setState((prev) => ({ ...prev, progress }));
      });
      setState((prev) => ({ ...prev, status: "success" }));
    } catch (error) {
      if (error.name !== "AbortError") {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: "Upload failed",
        }));
      }
    }
  }, []);

  return {
    state,
    handleSubmit,
    handleAbort,
    setFile: (file: File | null) => setState((prev) => ({ ...prev, file })),
  };
};

export const FileUploadForm = () => {
  const { state, handleSubmit, handleAbort, setFile } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (state.file) {
          handleSubmit(state.file);
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <div>
        {state.status === "uploading" && (
          <>
            <ProgressBar progress={state.progress} />
            <CancelButton onCancel={handleAbort} />
          </>
        )}

        {state.status === "error" && <ErrorDisplay message={state.error} />}
      </div>

      <SubmitButton
        isDisabled={!state.file || state.status === "uploading"}
        label={state.status === "uploading" ? "Uploading..." : "Upload"}
      />
    </form>
  );
};

const ProgressBar = ({ progress }: { progress: number }) => (
  <div>
    <progress value={progress} max="100" />
    <span>{progress}%</span>
  </div>
);

const CancelButton = ({ onCancel }: { onCancel: () => void }) => (
  <button type="button" onClick={onCancel}>
    Cancel Upload
  </button>
);

const ErrorDisplay = ({ message }: { message: string | null }) =>
  message && <div>{message}</div>;

const SubmitButton = ({
  isDisabled,
  label,
}: {
  isDisabled: boolean;
  label: string;
}) => (
  <button type="submit" disabled={isDisabled}>
    {label}
  </button>
);
```

## Flashcard

### How to implement cancellable file upload?

Use `AbortController` to create cancelable requests.

Example:

```tsx
const controller = new AbortController();
fetch(url, { signal: controller.signal });
// Cancel with controller.abort()
```
