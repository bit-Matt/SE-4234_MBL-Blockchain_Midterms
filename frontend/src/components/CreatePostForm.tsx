import { useState } from "react";
import type { FormEvent } from "react";

type Props = {
  onSubmit: (imageUrl: string, caption: string) => Promise<boolean>;
  disabled: boolean;
};

export function CreatePostForm({ onSubmit, disabled }: Props) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [caption, setCaption] = useState<string>("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const created = await onSubmit(imageUrl.trim(), caption.trim());
    if (created) {
      setImageUrl("");
      setCaption("");
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Create post</h2>
      <label>
        Image URL
        <input
          type="url"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="https://picsum.photos/600/400"
          required
        />
      </label>
      <label>
        Caption
        <input
          type="text"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="Say something"
          maxLength={160}
          required
        />
      </label>
      <button type="submit" disabled={disabled}>
        Publish
      </button>
    </form>
  );
}
