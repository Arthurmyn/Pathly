import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function Privacy() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
      <p className="text-muted">This page describes the intended behaviour of the platform. This demo stores nothing on a server.</p>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">What is stored</h2>
        <p className="text-muted">Only the profile fields needed to compare you with requirements: degree, field, target level and country, GPA, language score, exams, work experience, intake and budget. No documents are uploaded.</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">What is sent to the AI provider</h2>
        <p className="text-muted">Only the text of your message needed to extract the profile or answer a question, and the verified records that support an answer. Eligibility is never decided by the language model.</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Delete your data</h2>
        <p className="text-muted">You can delete your account and all of your data in Settings. This removes your profile and chat history.</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">In this demo</h2>
        <p className="text-muted">Your profile and progress live only in this browser (local storage). &quot;Reset demo&quot; in the top bar clears them.</p>
      </section>
    </article>
  );
}
