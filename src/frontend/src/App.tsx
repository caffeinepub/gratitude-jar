import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Bell, BellOff, Quote, Sparkles, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────
type Note = {
  id: string;
  text: string;
  createdAt: number;
};

const STORAGE_KEY = "gratitude_jar_notes";
const REMINDER_KEY = "gratitude_jar_reminder";

// ── localStorage helpers ──────────────────────────────────────────────
function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Note[];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function loadReminder(): boolean {
  return localStorage.getItem(REMINDER_KEY) === "true";
}

function saveReminder(value: boolean): void {
  localStorage.setItem(REMINDER_KEY, String(value));
}

// ── Relative time ─────────────────────────────────────────────────────
function relativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

// ── Jar SVG ───────────────────────────────────────────────────────────
function JarIcon({ count }: { count: number }) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width="72"
        height="88"
        viewBox="0 0 72 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Gratitude jar"
        role="img"
        className="drop-shadow-sm"
      >
        {/* Lid top */}
        <rect
          x="18"
          y="4"
          width="36"
          height="6"
          rx="3"
          fill="oklch(0.52 0.09 155)"
          opacity="0.85"
        />
        {/* Lid base band */}
        <rect
          x="14"
          y="9"
          width="44"
          height="8"
          rx="2"
          fill="oklch(0.52 0.09 155)"
          opacity="0.7"
        />
        {/* Jar body */}
        <path
          d="M16 20 Q14 22 13 28 L10 72 Q10 80 18 82 L54 82 Q62 80 62 72 L59 28 Q58 22 56 20 Z"
          fill="oklch(0.97 0.015 85)"
          stroke="oklch(0.82 0.04 80)"
          strokeWidth="1.5"
        />
        {/* Jar shoulder curve */}
        <path
          d="M16 20 L56 20"
          stroke="oklch(0.82 0.04 80)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Inner fill (notes) – grows with count */}
        {count > 0 && (
          <path
            d={`M14 ${82 - Math.min(count * 5, 52)} Q14 ${84 - Math.min(count * 5, 52)} 18 ${84 - Math.min(count * 5, 52)} L54 ${84 - Math.min(count * 5, 52)} Q58 ${84 - Math.min(count * 5, 52)} 59 ${82 - Math.min(count * 5, 52)} L61 72 Q62 80 54 82 L18 82 Q10 80 11 72 Z`}
            fill="oklch(0.86 0.065 150)"
            opacity="0.5"
          />
        )}
        {/* Shine */}
        <path
          d="M20 30 Q19 45 20 60"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Little folded notes inside */}
        {count > 0 && (
          <>
            <rect
              x="26"
              y="56"
              width="14"
              height="10"
              rx="1.5"
              fill="oklch(0.91 0.045 10)"
              opacity="0.75"
              transform="rotate(-8 33 61)"
            />
            {count > 1 && (
              <rect
                x="34"
                y="52"
                width="12"
                height="9"
                rx="1.5"
                fill="oklch(0.94 0.07 85)"
                opacity="0.75"
                transform="rotate(6 40 56)"
              />
            )}
            {count > 2 && (
              <rect
                x="22"
                y="48"
                width="10"
                height="8"
                rx="1.5"
                fill="oklch(0.87 0.06 155)"
                opacity="0.7"
                transform="rotate(-12 27 52)"
              />
            )}
          </>
        )}
      </svg>
      {/* Note count badge */}
      <div
        className="absolute -top-1 -right-2 min-w-[1.5rem] h-6 flex items-center justify-center
                       rounded-full bg-sage-500 text-white text-xs font-semibold px-1.5
                       shadow-sm tabular-nums"
      >
        {count}
      </div>
    </div>
  );
}

// ── Note Card ─────────────────────────────────────────────────────────
function NoteCard({
  note,
  index,
  onDelete,
}: {
  note: Note;
  index: number;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      data-ocid={`jar.note.item.${index}`}
      className="group flex items-start gap-3 p-4 rounded-xl
                 bg-card/80 border border-border/60 shadow-card
                 animate-fade-in-up transition-shadow duration-200
                 hover:shadow-card-hover"
      style={{ animationDelay: `${(index - 1) * 0.04}s` }}
    >
      <Quote
        className="mt-0.5 shrink-0 text-sage-300"
        size={14}
        aria-hidden="true"
      />
      <p className="flex-1 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
        {note.text}
      </p>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-xs text-muted-foreground/70 whitespace-nowrap">
          {relativeTime(note.createdAt)}
        </span>
        <button
          type="button"
          data-ocid={`jar.note.delete_button.${index}`}
          onClick={() => onDelete(note.id)}
          aria-label="Delete note"
          className="p-1.5 rounded-lg text-muted-foreground/50
                     hover:text-destructive hover:bg-blush-100
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-ring
                     transition-colors duration-150 opacity-0
                     group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Trash2 size={13} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────
export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [inputText, setInputText] = useState("");
  const [reminderOn, setReminderOn] = useState(() => loadReminder());
  const [randomNote, setRandomNote] = useState<Note | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sync notes to localStorage whenever they change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const handleAddNote = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;

    const newNote: Note = {
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setInputText("");
    toast.success("Gratitude added ✨", { duration: 2000 });
  }, [inputText]);

  const handleDelete = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast("Note removed", { duration: 1500 });
  }, []);

  const handlePullRandom = useCallback(() => {
    if (notes.length === 0) {
      setRandomNote(null);
      setDialogOpen(true);
      return;
    }
    const idx = Math.floor(Math.random() * notes.length);
    setRandomNote(notes[idx]);
    setDialogOpen(true);
  }, [notes]);

  const handleReminderToggle = useCallback((checked: boolean) => {
    setReminderOn(checked);
    saveReminder(checked);
    if (checked) {
      toast("Reminder set for tomorrow morning 🌅", { duration: 2500 });
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        handleAddNote();
      }
    },
    [handleAddNote],
  );

  // Sorted newest-first (already added newest first, just display)
  const sortedNotes = notes;

  return (
    <>
      <Toaster position="top-center" />

      <div className="min-h-screen flex flex-col items-center px-4 py-8">
        {/* ── App shell: max-width 420px ── */}
        <div className="w-full max-w-[420px] flex flex-col gap-6">
          {/* ── Header ── */}
          <header className="flex flex-col items-center gap-3 pt-4 animate-fade-in">
            <JarIcon count={notes.length} />
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Gratitude Jar
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {notes.length === 0
                  ? "Add your first gratitude note"
                  : notes.length === 1
                    ? "1 gratitude saved"
                    : `${notes.length} gratitudes saved`}
              </p>
            </div>
          </header>

          {/* ── Add note form ── */}
          <section
            aria-label="Add a gratitude note"
            className="flex flex-col gap-3 p-5 rounded-2xl bg-card/70 border border-border/50 shadow-card animate-fade-in"
            style={{ animationDelay: "0.05s" }}
          >
            <Label
              htmlFor="note-input"
              className="text-sm font-medium text-foreground/80"
            >
              What are you grateful for today?
            </Label>
            <Textarea
              id="note-input"
              data-ocid="jar.note_input"
              placeholder="I'm grateful for…"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              maxLength={500}
              className="resize-none rounded-xl border-border/70 bg-cream-50/80
                         focus:ring-sage-500/40 focus:border-sage-400
                         placeholder:text-muted-foreground/50 text-sm"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground/60">
                {inputText.length > 0 && `${inputText.length}/500`}
              </span>
              <Button
                data-ocid="jar.add_button"
                onClick={handleAddNote}
                disabled={inputText.trim().length === 0}
                className="rounded-xl bg-sage-500 hover:bg-sage-600 text-white
                           font-medium px-5 h-10 shadow-sm
                           disabled:opacity-40 transition-all duration-150"
              >
                Add gratitude
              </Button>
            </div>
            <p className="text-xs text-muted-foreground/50 text-right -mt-1">
              Tip: Ctrl+Enter to save
            </p>
          </section>

          {/* ── Pull random button ── */}
          <Button
            data-ocid="jar.random_button"
            onClick={handlePullRandom}
            variant="outline"
            className="w-full h-12 rounded-xl border-blush-200 bg-blush-50/60
                       text-accent-foreground hover:bg-blush-100/80
                       font-medium gap-2 shadow-sm transition-all duration-150
                       animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <Sparkles size={16} className="text-blush-300" aria-hidden="true" />
            Pull a random gratitude
          </Button>

          {/* ── Notes list ── */}
          <section
            aria-label="Your gratitude notes"
            className="flex flex-col gap-3 animate-fade-in"
            style={{ animationDelay: "0.12s" }}
          >
            <h2 className="text-sm font-medium text-muted-foreground px-1">
              Your jar
            </h2>

            {sortedNotes.length === 0 ? (
              <div
                data-ocid="jar.empty_state"
                className="flex flex-col items-center gap-3 py-12 rounded-2xl
                           border border-dashed border-border/60 text-center
                           bg-card/30"
              >
                <span className="text-3xl" aria-hidden="true">
                  🌿
                </span>
                <p className="text-sm text-muted-foreground/70 max-w-[220px]">
                  Your jar is empty. Add something you're grateful for today.
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-[420px]">
                <div
                  data-ocid="jar.note_list"
                  className="flex flex-col gap-2.5 pr-1"
                >
                  {sortedNotes.map((note, i) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      index={i + 1}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </section>

          {/* ── Daily reminder toggle ── */}
          <section
            aria-label="Daily reminder"
            className="flex items-center justify-between p-4 rounded-xl
                       bg-card/60 border border-border/50 shadow-xs
                       animate-fade-in"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="flex items-center gap-3">
              {reminderOn ? (
                <Bell size={16} className="text-sage-500" aria-hidden="true" />
              ) : (
                <BellOff
                  size={16}
                  className="text-muted-foreground/50"
                  aria-hidden="true"
                />
              )}
              <div>
                <Label
                  htmlFor="reminder-switch"
                  className="text-sm font-medium cursor-pointer"
                >
                  Daily reminder
                </Label>
                {reminderOn ? (
                  <p className="text-xs text-sage-500 mt-0.5">
                    Reminder set for tomorrow morning 🌅
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    Get a gentle nudge each morning
                  </p>
                )}
              </div>
            </div>
            <Switch
              id="reminder-switch"
              data-ocid="jar.reminder_toggle"
              checked={reminderOn}
              onCheckedChange={handleReminderToggle}
              aria-label="Toggle daily reminder"
              className="data-[state=checked]:bg-sage-500"
            />
          </section>

          {/* ── Footer ── */}
          <footer
            className="text-center pb-6 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <p className="text-xs text-muted-foreground/50">
              © {new Date().getFullYear()}. Built with{" "}
              <span aria-label="love">♥</span> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </footer>
        </div>
      </div>

      {/* ── Random Gratitude Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="jar.random_dialog"
          className="max-w-[360px] mx-auto rounded-2xl border-border/60 shadow-lg
                     bg-card p-0 overflow-hidden"
          aria-describedby="random-dialog-description"
        >
          {randomNote ? (
            <>
              {/* Decorative top strip */}
              <div className="h-2 w-full bg-gradient-to-r from-sage-200 via-sage-300 to-blush-200" />
              <div className="p-6 flex flex-col gap-4">
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles
                      size={16}
                      className="text-sage-500"
                      aria-hidden="true"
                    />
                    <DialogTitle className="text-base font-semibold text-foreground">
                      A gratitude from your jar
                    </DialogTitle>
                  </div>
                </DialogHeader>

                <div
                  id="random-dialog-description"
                  className="animate-scale-in bg-cream-100/80 border border-sage-100 rounded-xl p-5"
                >
                  <Quote
                    size={18}
                    className="text-sage-300 mb-2"
                    aria-hidden="true"
                  />
                  <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {randomNote.text}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-3">
                    {relativeTime(randomNote.createdAt)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePullRandom}
                    className="flex-1 h-10 rounded-xl border-sage-200 hover:bg-sage-50 text-sm"
                  >
                    Pull another
                  </Button>
                  <Button
                    data-ocid="jar.random_dialog.close_button"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1 h-10 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-sm"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="h-2 w-full bg-gradient-to-r from-blush-100 via-blush-200 to-sage-200" />
              <div className="p-6 flex flex-col items-center gap-4 text-center">
                <DialogHeader>
                  <DialogTitle className="sr-only">No notes yet</DialogTitle>
                </DialogHeader>
                <span className="text-4xl" aria-hidden="true">
                  🌱
                </span>
                <div id="random-dialog-description">
                  <p className="text-base font-medium text-foreground">
                    Your jar is still empty
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Add your first gratitude note to get started.
                  </p>
                </div>
                <Button
                  data-ocid="jar.random_dialog.close_button"
                  onClick={() => setDialogOpen(false)}
                  className="mt-2 h-10 rounded-xl bg-sage-500 hover:bg-sage-600 text-white px-6 text-sm"
                >
                  Got it
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
