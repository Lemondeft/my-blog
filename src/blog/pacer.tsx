import { useNavigate } from "react-router-dom"
import Starfield from "../components/Starfield"
import CodeBlock from "../components/codeblock"

type Section = {
  title: string
  content: string
  code?: {
    filename: string
    language: string
    snippet: string
  }
}

const sections: Section[] = [
  {
    title: "Introduction",
    content:
      "Pacer is a sports tracking app I built with Flutter and Supabase Postgres. Runs, jogs, cycles, walks, plus a whole competitive layer on top: challenges, leaderboards, teams, a chat for the team, and a coach role that can grade you. The interesting part for me was not the map, it was turning a hand drawn data flow diagram into a real database without rewriting the frontend.",
  },
  {
    title: "Starting from a drawing",
    content:
      "The whole thing started as manual.drawio.xml, a DFD I drew for a class project. Processes 1.0 to 5.0, stores labelled like books. Users, activity, statistics, streak, challenge, participation, leaderboard, ranking, teams, team members, route points. The rule I set for myself was that the manual's books become real tables and the frontend stays untouched. If the diagram says there is a store called rute_points then rute_points exists, with the columns the diagram implies, not the ones I wished I had.",
  },
  {
    title: "The schema",
    content:
      "Eleven tables, all under Postgres with Supabase Auth for identities. A user id is always auth.users.id, never a free floating uuid, so the database knows who the caller is without the app telling it. Activity types are run, jog, cycle, walk, which in the schema are lari, jogging, bersepeda, berjalan. That mix of languages in one codebase is intentional, the Indonesian terms come from the domain the manual was written in.",
    code: {
      filename: "20261009120000_pacer_initial.sql",
      language: "sql",
      snippet: `create table public.aktivitas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  jenis text not null check (jenis in ('lari', 'joging', 'bersepeda', 'berjalan')),
  mulai_at timestamptz,
  selesai_at timestamptz,
  durasi_s integer check (durasi_s is null or durasi_s >= 0),
  jarak_m numeric check (jarak_m is null or jarak_m >= 0),
  created_at timestamptz not null default now()
);`,
    },
  },
  {
    title: "The recorder",
    content:
      "Tracking lives in a plain ChangeNotifier with no widgets inside, so the same class works in the app, in tests, and in the desktop simulation mode. Two things cost me real time. First, accuracy. Fixes worse than 20 metres are dropped because in a city the GPS jitters enough to invent distance you never travelled. Second, pausing. A stopwatch that keeps running while paused gives you a run that never happened, so pause and resume freeze both the fixes and the clock, and the duration written to the database is the client measured one, not wall clock time.",
    code: {
      filename: "lib/src/tracking/recorder.dart",
      language: "dart",
      snippet: `class RunRecorder extends ChangeNotifier {
  static const double maxAccuracyM = 20;
  static const int distanceFilterM = 5;

  /// True between _begin and insert-return; blocks double-tap double rows.
  bool _starting = false;
  final Stopwatch _clock = Stopwatch();
  final List<_Fix> _fixes = [];`,
    },
  },
  {
    title: "Saving the route",
    content:
      "Route points are written in one batch when the run ends instead of one insert per GPS fix. Streaming inserts on a phone network is a great way to lose a run, and a run with 400 points is 400 round trips. The batch goes through a repository method that takes the list and hands it to Supabase in a single insert.",
    code: {
      filename: "lib/src/aktivitas/activity_repository.dart",
      language: "dart",
      snippet: `final rows = [
  for (final point in points)
    {...point.toJson(), 'aktivitas_id': aktivitasId},
];
await _client.from('rute_points').insert(rows);`,
    },
  },
  {
    title: "Maps without an API key",
    content:
      "The map is OpenStreetMap tiles through flutter_map, deliberately, because CARTO needs an API key and this app has no backend to hide it in. OSM policy also asks for plain tile hosts, so no subdomains. Offline is a real mode, not a fallback: minimal mode drops the tiles entirely and paints a grid with the route fitted on top, and the grid is also the layer behind the tiles so a tile failure degrades into something readable instead of a hole. The attribution chip is legally required and it overflowed the device layout by 50 pixels until I made it compact.",
  },
  {
    title: "Teams, challenges, leaderboards",
    content:
      "The competitive layer is three tables wide: challenges with a participation table, leaderboards, and rankings. Everyone authenticated can read them, so you can see where you stand without being in a team. Joining a team needs an invite code, and the coach role can create challenges, manage team rosters, and post a class board. Team chat is in development and still carries a beta badge because I do not trust it yet.",
  },
  {
    title: "The security model",
    content:
      "This is the part I care about most. Row level security is deny by default on every table, and access is decided by a function that reads the caller's role from the database rather than trusting a flag the app sent. The service_role key never ships inside the app, only the anon key does, and coach writes are gated on the role column. The role column itself is the one place worth hardening, because a user who could change their own role to coach would own the whole app, and there is a dedicated migration for exactly that.",
    code: {
      filename: "20261009120000_pacer_initial.sql",
      language: "sql",
      snippet: `create or replace function public.is_coach_or_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.peran in ('coach', 'admin')
  );
$$;`,
    },
  },
  {
    title: "Nine migrations, in order",
    content:
      "The schema is not one big SQL file, it is nine migrations that have to run in order from the Supabase SQL editor. Initial tables and policies, then role grants for the API role, then hardening for role escalation, then the language preference column, then coach read access for grading, then chat, then function EXECUTE lockdown, then invite codes, then profile stats. Rerunning a migration is harmless because duplicate object names error out quietly, which is a nice property to have when the dashboard is your migration runner.",
  },
  {
    title: "Two languages",
    content:
      "The UI toggles between English and Indonesian and the choice is stored per user in users.language, not in local storage, so it follows you to another device. Some strings are the domain's own vocabulary, lari and bersepeda stay, because translating the name of the activity is how you end up with a confusing app for the people who actually run.",
  },
  {
    title: "What I Learned",
    content:
      "How to read a DFD as a schema instead of a drawing. That accuracy filtering is a data problem, not a display problem. That pause semantics have to be designed before the stopwatch, not patched after. Batch writes, because mobile networks fail. How Supabase RLS works with security definer helper functions, and why the role column is the crown jewel. That OSM tile policy is real and you will get the subdomain question asked. And that shipping a coach role safely means writing the escalation guard migration before you write the first policy.",
  },
  {
    title: "Source code",
    content:
      "The whole thing is on GitHub at github.com/Lemondeft/pacer. The README lists the migration order and the security model, and the supabase folder has every SQL file if you want to read the policies. The Flutter app runs on Linux, web, and Android, and the tracker's simulation mode lets you try the full pipeline on a desktop with no GPS at all.",
  },
]

export default function Pacer() {
  const navigate = useNavigate()

  return (
    <div className="bg-black min-h-screen text-white">
      <Starfield />

      <div
        className="max-w-7xl mx-auto py-8 md:py-16 px-4 relative page-enter"
        style={{ zIndex: 1 }}
      >
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 border border-white/20 rounded hover:border-white/60 transition-all duration-300 hover:scale-[1.1] hover:shadow-[0_0_20px_rgba(100,200,255,0.1)]"
        >
          ← back
        </button>

        <h1 className="text-2xl md:text-4xl font-bold mt-8">
          Pacer<span className="caret">_</span>
        </h1>
        <p className="text-white/70 mt-4 font-light">
          A Flutter GPS run tracker backed by Supabase Postgres.
        </p>

        <div className="border border-white/20 rounded-xl p-6 mt-8 bg-black/20">
          <p className="text-white/50 font-mono">// pacer</p>
          <h2 className="text-2xl font-bold mt-2">
            Flutter · Supabase · Postgres
          </h2>
          <p className="text-white/70 mt-2">Run tracking, teams, challenges and streaks</p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8 mt-12">
          {sections.map((item) => (
            <div
              key={item.title}
              className="p-6 border-b border-white/10 last:border-none"
            >
              <h2 className="text-white text-2xl font-bold mb-2">
                {item.title}
              </h2>
              <p className="text-white/80 font-light text-lg leading-relaxed">
                {item.content || " "}
              </p>

              {item.code && (
                <CodeBlock
                  filename={item.code.filename}
                  language={item.code.language}
                  snippet={item.code.snippet}
                />
              )}
            </div>
          ))}
        </div>

        <footer className="border-t border-white/20 text-white/40 text-sm text-center py-6 mt-16">
          © 2026 Lemondeft. Made with useless tinkering.
        </footer>
      </div>
    </div>
  )
}
