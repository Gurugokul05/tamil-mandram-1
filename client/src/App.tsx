import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, CalendarCheck, CalendarDays, Check, Menu, Sparkles, X } from 'lucide-react';
import { Link, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

const events = [
  ['01', 'MILIR', 'The journey continues', 'Music, dance, oratory and drama rooted in Tamil tradition.'],
  ['02', 'ARAM', 'A tribute to our teachers', 'Games, performances and tokens of appreciation for faculty.'],
  ['03', 'MAHATHMA', 'Culture in community', 'A heritage tour with cleanliness drives and community interaction.'],
  ['04', 'ROWTHIRAM', 'The fire of Bharathi', 'Poetry, speeches, skits and music celebrating Bharathiyar.'],
  ['05', 'PAAVAI VIZHA', 'The voice of devotion', 'Thiruppavai, classical dance, storytelling and poetry.'],
  ['06', 'PONGAL', 'A harvest of joy', 'Kolams, uriyadi, folk dance and paraiattam in ethnic wear.'],
  ['07', 'TAMIZHI', 'One language, many voices', 'Competitions and recitations for World Mother Tongue Day.'],
  ['08', 'VALAM', 'A new year in Tamil', 'Traditional art forms, music, drama and cultural games.'],
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), reduceMotion ? 100 : 1200);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [reduceMotion]);

  return (
    <main>
      <AnimatePresence>
        {loading && <motion.div className="preloader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .45 }}>
          <motion.div className="preloader-mark" initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .5 }}>த</motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>KARE THAMIZH MANDRAM</motion.p>
        </motion.div>}
      </AnimatePresence>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} />
      <nav className="nav-shell">
        <a className="brand" href="#top"><span className="brand-mark">த</span><span>KARE <b>THAMIZH</b><br />MANDRAM</span></a>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {['About', 'Events', 'Gallery', 'Team', 'Membership'].map((item) => <Link key={item} to={`/${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</Link>)}
          <Link className="login-link" to="/membership">Member login <ArrowUpRight size={14} /></Link>
        </div>
        <button className="menu-button" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </nav>

      <section className="hero" id="top">
        <div className="grain" />
        <div className="ambient-letters" aria-hidden="true"><span>அ</span><span>ஆ</span><span>இ</span><span>ழ</span><span>த</span></div>
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}><span className="eyebrow-line" /> A living tradition since 2008</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .7 }}>தமிழ்<br /><em>மன்றம்</em></motion.h1>
          <motion.p className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .65 }}>KARE Thamizh Mandram</motion.p>
          <motion.p className="hero-intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .75 }}>Where language becomes rhythm, heritage becomes movement, and every student finds a voice.</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9 }}><a className="button button-gold" href="#events">Explore events <ArrowUpRight size={16} /></a><Link className="button button-outline" to="/membership">Register now</Link></motion.div>
        </div>
        <motion.div className="hero-art" aria-label="Decorative Tamil heritage illustration" animate={reduceMotion ? undefined : { y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="sun-ring" /><div className="art-letter">ழ</div><div className="art-caption">அறம்<br /><span>அறிவின் வேர்கள்</span></div>
          <div className="art-lines" />
        </motion.div>
        <div className="scroll-cue"><ArrowDown size={16} /> Scroll to discover</div>
      </section>

      <section className="notice-strip"><span className="pulse" /> <b>Membership 2026</b><span>Applications are now open for the new academic year</span><a href="#membership">Join the mandram <ArrowUpRight size={14} /></a></section>

      <section className="intro-section" id="about">
        <div className="section-label">01 / Our story</div>
        <div><h2>A language is not<br />just spoken.<br /><em>It is lived.</em></h2><p className="body-copy">Founded in 2008 at Kalasalingam Academy of Research and Education, KARE Thamizh Mandram has been promoting Tamil language, culture and heritage through creative programs, festivals and student-driven initiatives.</p><a className="text-link" href="#team">Read our story <ArrowUpRight size={15} /></a></div>
        <div className="stats"><div><strong>100<span>+</span></strong><small>Events conducted</small></div><div><strong>16<span>+</span></strong><small>Years of culture</small></div><div><strong>2K<span>+</span></strong><small>Student voices</small></div></div>
      </section>

      <section className="events-section" id="events">
        <div className="events-heading"><div><div className="section-label">02 / The calendar</div><h2>Eight ways to<br /><em>celebrate.</em></h2></div><p>From the harvest fields to the poetry stage, our annual festivals keep Tamil culture in motion.</p></div>
        <div className="event-grid">{events.map(([number, title, subtitle, description], index) => <motion.article className="event-card" key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: index * .06 }}><span className="event-number">{number}</span><div className="event-icon"><Sparkles size={18} /></div><h3>{title}</h3><p className="event-subtitle">{subtitle}</p><p>{description}</p><a href="#membership" aria-label={`Learn about ${title}`}><ArrowUpRight size={18} /></a></motion.article>)}</div>
      </section>

      <section className="membership-section" id="membership"><div><div className="section-label">03 / Find your place</div><h2>There is a story<br /><em>waiting for you.</em></h2></div><div><p>Join a community of readers, performers, thinkers and makers. No matter your department or year, there is always room on this stage.</p><Link className="button button-gold" to="/membership">Register your interest <ArrowUpRight size={16} /></Link></div></section>
      <footer><div className="brand"><span className="brand-mark">த</span><span>KARE <b>THAMIZH</b><br />MANDRAM</span></div><p>Preserving Tamil language, culture and heritage through student initiatives.</p><span>© 2026 KARE Thamizh Mandram</span><a href="#top"><ArrowUpRight size={16} /></a></footer>
    </main>
  );
}

const pageData: Record<string, { label: string; title: string; intro: string }> = {
  about: { label: '01 / The mandram', title: 'A story that keeps unfolding.', intro: 'Since 2008, KARE Thamizh Mandram has made Tamil language and culture a living part of campus life.' },
  gallery: { label: '02 / In frames', title: 'Memories in motion.', intro: 'A glimpse into the celebrations, stages and quiet moments that make our community.' },
  team: { label: '03 / The people', title: 'Many hands. One voice.', intro: 'Meet the faculty mentors and student leaders carrying the mandram forward.' },
  membership: { label: '04 / Join us', title: 'Find your place on the stage.', intro: 'Membership is open to every KARE student who wants to learn, make and share.' },
  blogs: { label: '05 / Journal', title: 'Notes from the journey.', intro: 'Stories, reflections and literary pieces from the Thamizh Mandram community.' },
  contact: { label: '06 / Write to us', title: 'Let’s begin a conversation.', intro: 'Reach the mandram at KARE Campus, Krishnankoil, Tamil Nadu.' },
};

function PublicPage({ type }: { type: keyof typeof pageData }) {
  const page = pageData[type];
  return <div className="inner-page">
    <header className="inner-header"><Link className="brand" to="/"><span className="brand-mark">த</span><span>KARE <b>THAMIZH</b><br />MANDRAM</span></Link><Link className="back-link" to="/">Back home <ArrowUpRight size={14} /></Link></header>
    <section className="inner-hero"><div className="section-label">{page.label}</div><h1>{page.title}</h1><p>{page.intro}</p></section>
    {type === 'about' && <section className="content-grid"><div><h2>Language is memory.<br /><em>Culture is tomorrow.</em></h2></div><p>What began as a student initiative has grown into a vibrant platform for festivals, competitions, literary conversations and community service. We believe tradition stays alive when young people make it their own.</p></section>}
    {type === 'gallery' && <section className="gallery-grid">{['PONGAL', 'MILIR', 'TAMIZHI', 'VALAM', 'ARAM', 'ROWTHIRAM'].map((item, index) => <div className={`gallery-tile tile-${index + 1}`} key={item}><span>{item}</span></div>)}</section>}
    {type === 'team' && <section className="people-grid">{['Faculty Coordinator', 'President', 'Student Coordinator', 'Literary Secretary'].map((role, index) => <article className="person-card" key={role}><div className="person-avatar">{['அ', 'த', 'ம', 'ழ'][index]}</div><span>{role}</span><h3>{['Our faculty mentor', 'The student voice', 'Events & community', 'Words & ideas'][index]}</h3></article>)}</section>}
    {type === 'membership' && <section className="content-grid"><div><h2>Bring your curiosity.<br /><em>We’ll bring the stage.</em></h2></div><form className="interest-form" onSubmit={(event) => event.preventDefault()}><label>Name<input required placeholder="Your name" /></label><label>Register number<input required placeholder="KARE..." /></label><label>Email<input required type="email" placeholder="you@example.com" /></label><button className="button button-gold" type="submit">Submit interest <ArrowUpRight size={16} /></button></form></section>}
    {type === 'blogs' && <section className="empty-state"><Sparkles size={20} /><h2>Coming soon.</h2><p>Our first collection of stories is being written.</p></section>}
    {type === 'contact' && <section className="content-grid"><div><h2>Say வணக்கம்.</h2><p className="body-copy">tamilmandram@klu.ac.in<br />+91 93443 67177<br />KARE Campus, Krishnankoil</p></div><form className="interest-form" onSubmit={(event) => event.preventDefault()}><label>Your email<input required type="email" placeholder="you@example.com" /></label><label>Message<textarea required rows={5} placeholder="Write to the mandram..." /></label><button className="button button-gold" type="submit">Send message <ArrowUpRight size={16} /></button></form></section>}
    <footer><Link className="brand" to="/"><span className="brand-mark">த</span><span>KARE <b>THAMIZH</b><br />MANDRAM</span></Link><span>© 2026 KARE Thamizh Mandram</span></footer>
  </div>;
}

function EventsPage() {
  return <div className="inner-page"><header className="inner-header"><Link className="brand" to="/"><span className="brand-mark">த</span><span>KARE <b>THAMIZH</b><br />MANDRAM</span></Link><Link className="back-link" to="/">Back home <ArrowUpRight size={14} /></Link></header><section className="inner-hero"><div className="section-label">The calendar / 2026</div><h1>Eight ways to<br /><em>celebrate.</em></h1><p>Annual festivals, literary celebrations and moments that bring the campus together.</p></section><section className="event-grid inner-events">{events.map(([number, title, subtitle, description]) => <article className="event-card" key={title}><span className="event-number">{number}</span><div className="event-icon"><Sparkles size={18} /></div><h3>{title}</h3><p className="event-subtitle">{subtitle}</p><p>{description}</p><Link to="/membership" aria-label={`Register for ${title}`}><ArrowUpRight size={18} /></Link></article>)}</section><footer><Link className="brand" to="/"><span className="brand-mark">த</span><span>KARE <b>THAMIZH</b><br />MANDRAM</span></Link><span>© 2026 KARE Thamizh Mandram</span></footer></div>;
}

function Portal() {
  const [registered, setRegistered] = useState<string[]>(['ARAM']);
  const toggleRegistration = (title: string) => setRegistered((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
  return <div className="portal-page"><aside className="portal-sidebar"><Link className="brand" to="/"><span className="brand-mark">த</span><span>KARE <b>THAMIZH</b><br />MANDRAM</span></Link><div className="portal-nav"><span className="portal-active"><CalendarDays size={16} /> Overview</span><span><CalendarCheck size={16} /> Attendance</span><span><Sparkles size={16} /> Events</span></div><Link className="portal-exit" to="/">Exit portal <ArrowUpRight size={14} /></Link></aside><section className="portal-main"><header className="portal-top"><div><span className="section-label">Member portal / 2026</span><h1>Vanakkam, <em>member.</em></h1></div><div className="profile-chip"><span>த</span><div><b>Member account</b><small>Application approved</small></div></div></header><div className="portal-stats"><div><small>Attendance</small><strong>86<span>%</span></strong><p>+4% this semester</p></div><div><small>Events joined</small><strong>12</strong><p>3 upcoming</p></div><div><small>Activity points</small><strong>240</strong><p>Level 03 · Kural</p></div></div><div className="portal-section-head"><div><span className="section-label">Your calendar</span><h2>Upcoming events</h2></div><Link to="/events">View all <ArrowUpRight size={14} /></Link></div><div className="portal-events">{events.slice(0, 4).map(([number, title, subtitle, description]) => <article className="portal-event" key={title}><span className="event-number">{number}</span><div><small>2026 / {String(Number(number) + 1).padStart(2, '0')} / 15</small><h3>{title}</h3><p>{subtitle}</p></div><button className={registered.includes(title) ? 'registered' : ''} onClick={() => toggleRegistration(title)}>{registered.includes(title) ? <><Check size={14} /> Registered</> : 'Register'}</button></article>)}</div></section></div>;
}

function Admin() {
  const [tab, setTab] = useState<'overview' | 'approvals' | 'events'>('overview');
  const [approved, setApproved] = useState<string[]>([]);
  const approvals = [['A. Kavin', 'KARE23CS011', 'Computer Science', '2nd year'], ['S. Nila', 'KARE24ME082', 'Mechanical Engineering', '1st year'], ['R. Ashwin', 'KARE22EC041', 'Electronics', '3rd year']];
  return <div className="admin-page"><aside className="portal-sidebar"><Link className="brand" to="/"><span className="brand-mark">த</span><span>KARE <b>THAMIZH</b><br />MANDRAM</span></Link><div className="portal-nav"><button className={tab === 'overview' ? 'portal-active' : ''} onClick={() => setTab('overview')}><CalendarDays size={16} /> Overview</button><button className={tab === 'approvals' ? 'portal-active' : ''} onClick={() => setTab('approvals')}><Check size={16} /> Approvals <b className="nav-count">3</b></button><button className={tab === 'events' ? 'portal-active' : ''} onClick={() => setTab('events')}><Sparkles size={16} /> Events</button></div><Link className="portal-exit" to="/">Exit admin <ArrowUpRight size={14} /></Link></aside><section className="portal-main"><header className="portal-top"><div><span className="section-label">Admin workspace / 2026</span><h1>Good morning, <em>coordinator.</em></h1></div><div className="profile-chip"><span>த</span><div><b>Faculty coordinator</b><small>All systems operational</small></div></div></header>{tab === 'overview' && <><div className="portal-stats"><div><small>Approved members</small><strong>248</strong><p>+18 this intake</p></div><div><small>Pending review</small><strong>24</strong><p>12 president · 12 faculty</p></div><div><small>Event turnout</small><strong>86<span>%</span></strong><p>Across 8 signature events</p></div></div><div className="admin-chart"><div className="portal-section-head"><div><span className="section-label">Participation</span><h2>Attendance trend</h2></div><span className="chart-period">This semester</span></div><div className="bars">{[48, 62, 54, 74, 68, 87, 78, 92].map((height, index) => <div className="bar-col" key={height}><div className="bar" style={{ height: `${height}%` }} /><small>{['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][index]}</small></div>)}</div></div></>}{tab === 'approvals' && <section className="admin-list"><div className="portal-section-head"><div><span className="section-label">Membership intake</span><h2>Approval queue</h2></div><span className="chart-period">3 awaiting review</span></div>{approvals.map(([name, regNo, department, year]) => <article className="approval-row" key={regNo}><div className="person-avatar small-avatar">{name[0]}</div><div><h3>{name}</h3><p>{regNo} · {department} · {year}</p></div>{approved.includes(regNo) ? <span className="approved-label"><Check size={14} /> Approved</span> : <div className="approval-actions"><button onClick={() => setApproved([...approved, regNo])}>Approve</button><button className="reject" onClick={() => setApproved([...approved, regNo])}>Reject</button></div>}</article>)}</section>}{tab === 'events' && <section className="admin-list"><div className="portal-section-head"><div><span className="section-label">Content management</span><h2>Signature events</h2></div><button className="button button-gold">Add event <ArrowUpRight size={14} /></button></div>{events.map(([number, title, subtitle]) => <article className="approval-row" key={title}><span className="event-number">{number}</span><div><h3>{title}</h3><p>{subtitle}</p></div><span className="status-pill">Published</span></article>)}</section>}</section></div>;
}

function App() {
  return <Routes><Route path="/" element={<Home />} /><Route path="/events" element={<EventsPage />} /><Route path="/portal" element={<Portal />} /><Route path="/admin" element={<Admin />} /><Route path="/verify/:certId" element={<PublicPage type="about" />} />{Object.keys(pageData).map((page) => <Route key={page} path={`/${page}`} element={<PublicPage type={page as keyof typeof pageData} />} />)}<Route path="*" element={<PublicPage type="about" />} /></Routes>;
}

export default App;
