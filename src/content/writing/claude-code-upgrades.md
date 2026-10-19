---
title: "Voicemail, resume and emoji: three upgrades to my local Claude Code"
dek: A spoken inbox for finished sessions, sessions that survive a Zed restart, and an emoji on every tab. All built in one weekend with Claude Code itself.
date: 2026-10-19
tags: [agents, tools]
---

On a normal day I have somewhere between five and fifteen Claude Code sessions open, each one in a Zed terminal thread, spread across a handful of projects. The agents are fine. I'm the bottleneck. I lose track of which session finished, which one is waiting on me, and what each tab is about. When Zed restarts, I lose the sessions completely.

So over one weekend I sat down with Claude Code and built three small things to fix that. Each one runs on Claude Code's **hooks**, the shell commands it runs at fixed points in a session's life.

| Upgrade | Hooks it uses | What it fixes |
| --- | --- | --- |
| Voicemail | `Stop`, `UserPromptSubmit`, `PreToolUse`, `SessionStart` | Knowing what finished, and answering it without switching windows |
| claude-zed | `SessionStart` (plus Zed's terminal init command) | Sessions dying when Zed restarts |
| Emoji titles | `SessionStart`, `UserPromptSubmit` | Telling a dozen tabs apart at a glance |

## Voicemail for agents

The idea: every session that finishes leaves me a voicemail. Not a notification I'll dismiss, but a short spoken summary in a first-in, first-out inbox. I play them one at a time, hear the full message if I want it, and answer by voice.

```
session stops ──Stop hook──▶ queue/<session>.json
                              └─ in the background: Haiku summary + ElevenLabs audio

hotkey ──▶ vm ──▶ play / full / reply / done

voice reply ──▶ mic ──▶ ElevenLabs speech-to-text ──▶ replies/<session>.txt
                                                          │
the session's background watcher ◀────────────────────────┘
  prints the reply and exits → Claude Code wakes the idle session
```

When a session stops, the `Stop` hook queues its final message. A detached process asks Haiku for a one-or-two-line summary and has ElevenLabs speak it, so by the time I press play the audio is already cached. Playback runs at 1.3× because agents are wordy.

The reply path is the part I like most. Each session's `SessionStart` hook tells it to start a small background command, `vm watch <session>`, that waits for a reply file. When I record a reply, it's transcribed, written to that file, and the watcher exits with my words as its output. Claude Code treats a finished background task as something to act on, so the idle session wakes up, quotes what it heard (so I can catch transcription mistakes), and gets on with it. Then it starts a new watcher.

::figure[The Voicemail list in Raycast: waiting voicemail on top, then live sessions by state]{placeholder="SCREENSHOT — RAYCAST VOICEMAIL LIST"}

The front end is a Raycast extension: a list of voicemails plus every live session grouped into Working, Needs Attention and Idle, and a menu-bar item with a count. The commands I use most (play next, reply by voice, done and play next) are bound to global hotkeys, which means I can work through the inbox without looking at the screen.

Two small hooks keep the inbox honest. If I type into a session, or it picks up a reply and starts working again, its voicemail is out of date, so `UserPromptSubmit` and `PreToolUse` archive it. The `PreToolUse` one is a few lines of plain `sh` that only calls into the main script when something is actually queued, so tool calls stay fast.

:::note
Anything that can write to the replies folder can give instructions to your sessions. Keep it private to your user.
:::

## Sessions that survive a Zed restart

Zed reopens terminal threads after a restart, but as empty shells. Native resume for agent terminals is on Zed's list but not shipped yet. If `claude` is the terminal's start command, every restart gives you a fresh session, and the conversation you had in that tab is gone from view.

`claude-zed` is a small wrapper I set as Zed's `terminal_init_command` instead. It keeps a map of *Zed thread → Claude session*, and on startup it resumes whatever session that thread last ran.

The hard part was working out which thread a terminal belongs to, because Zed doesn't tell it. It took three versions:

1. **Match by order.** Restored threads come back in the same order, right? No: Zed starts restored terminals lazily, when you first click on them.
2. **Match by title.** Zed stores each thread's terminal title. But it also overwrites those titles on restart, so they don't survive long enough to match.
3. **Tag and look it up.** The wrapper sets a unique title on its own terminal, then watches Zed's local SQLite database for the thread row that picks up that title. Zed saves it in under 300 ms. That row's id is the thread. The wrapper puts the real title back and resumes the mapped session.

Version three is exact, and it held up on a real restart: every tab came back to the right conversation. A `SessionStart` hook keeps the map current when a session is cleared, resumed or forked, and `cr` (short for `claude-zed --resume`) falls back to the newest free session in the folder for tabs it has never seen.

::figure[After a Zed restart, each thread resumes its own session]{placeholder="SCREENSHOT — ZED SIDEBAR AFTER RESTART"}

## An emoji on every tab

Zed's agent sidebar shows each Claude session's title, and a dozen text titles look alike. I wanted icons. Zed extensions can't change sidebar icons, but a test with `/rename` showed that an emoji at the start of the title shows up just fine. So the icon became part of the title.

A hook on `SessionStart` and `UserPromptSubmit` checks the session title. If it doesn't start with an emoji, it asks Haiku for one and returns `"<emoji> <title>"` as the new title. A brand-new session has no title at its first prompt yet, so in that case Haiku writes one from the prompt: an emoji and two to five words.

```python
reply = haiku(
    "Write a title for a work session that starts with the request below: "
    "one emoji that best represents it, a space, then 2 to 5 words. "
    "Reply with the title only.\n\nRequest:\n" + prompt[:2000]
)
```

The emoji is cached per session, so the Haiku call (about five seconds) happens once. The call itself runs `claude -p` with hooks disabled and an environment flag set, so it can't trigger the same hook and recurse.

::figure[Zed's agent sidebar with an emoji on each session]{placeholder="SCREENSHOT — ZED SIDEBAR WITH EMOJI TITLES"}

## What I took away

- **Hooks are the extension point.** None of this touches Claude Code itself. It's a few scripts listening at the right moments: stop, prompt, tool use, session start.
- **Use a small model for small jobs.** Summaries and emoji are Haiku jobs, run through my own Claude Code login with `claude -p`. Cheap, fast, and no extra API key.
- **Work around the editor, don't fight it.** Zed doesn't expose thread ids or custom icons, but it does store titles and show them. Both workarounds lean on that.
- **Build it with the thing you're improving.** All three were built in Claude Code sessions, which were then running through voicemail, claude-zed and emoji titles by the end of the weekend.

[CLOSING — what's next, or how it feels to use day to day.]
