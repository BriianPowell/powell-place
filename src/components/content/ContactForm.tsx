"use client";

import { FormEvent, useState } from "react";
import styles from "./content.module.css";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: data.get("fullname"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Failed to send message");
      }

      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldRow}>
        <input
          className={styles.input}
          type="text"
          name="fullname"
          placeholder="Full Name"
          required
          disabled={state === "submitting" || state === "success"}
        />
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="Email Address"
          required
          disabled={state === "submitting" || state === "success"}
        />
      </div>
      <textarea
        className={styles.textarea}
        name="message"
        placeholder="Message"
        required
        disabled={state === "submitting" || state === "success"}
      />
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={state === "submitting" || state === "success"}
      >
        {state === "submitting" ? "Sending..." : state === "success" ? "Sent!" : "Send Message"}
      </button>
      {state === "success" && (
        <p className={`${styles.formMessage} ${styles.formMessageSuccess}`}>
          Message transmitted. I&apos;ll get back to you soon.
        </p>
      )}
      {state === "error" && (
        <p className={`${styles.formMessage} ${styles.formMessageError}`}>{errorMessage}</p>
      )}
    </form>
  );
}
