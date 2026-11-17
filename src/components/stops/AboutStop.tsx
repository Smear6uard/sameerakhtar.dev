import { Cover, SceneNote, Stop, TextLink, Ticket, TicketRule } from "@/components/ride/Stop";
import { education, experience, honors, skills } from "@/lib/resume";
import { site } from "@/lib/site";

/** Stop 5: about, between billboards of his photographs. */
export function AboutStop() {
  const earlier = experience.slice(2);

  return (
    <Stop id="about" side="left" className="stop-wide">
      <Cover>About</Cover>
      <Ticket>
        <div className="about-head">
          <img
            src="/profile.jpg"
            alt="Sameer Akhtar"
            width={600}
            height={800}
            loading="lazy"
            decoding="async"
            className="about-photo"
          />
          <div>
            <p>
              I study math and computer science at {education.school} and graduate in{" "}
              {site.graduation} with a {education.gpa.split(" ")[0]} GPA. In the last year I shipped
              a GenAI feature at Quantum Metric, built Renaro on my own, and launched Styleum to
              100+ users.
            </p>
            <p className="mt-3 text-[0.9375rem] text-ink-3">
              I also co-founded the Muslim Tech Builders newsletter, which has 500+ subscribers.
            </p>
          </div>
        </div>

        <TicketRule />
        <h3 className="ticket-title">Earlier roles</h3>
        <ul className="roles">
          {earlier.map((role) => (
            <li key={role.company}>
              <p className="roles-head">
                <span>
                  {role.company}, {role.title}
                </span>
                <span className="roles-when">{role.period}</span>
              </p>
              <p className="roles-body">{role.bullets[0]}</p>
            </li>
          ))}
        </ul>

        <TicketRule />
        <h3 className="ticket-title">Tools I use</h3>
        <dl className="skills">
          {skills.map((group) => (
            <div key={group.label}>
              <dt>{group.label}</dt>
              <dd>{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>

        <TicketRule />
        <h3 className="ticket-title">Recognition</h3>
        <ul className="roles">
          {honors.map((honor) => (
            <li key={honor.title}>
              <p className="roles-head">
                <span>
                  {honor.href ? <TextLink href={honor.href}>{honor.title}</TextLink> : honor.title}
                </span>
                <span className="roles-when">{honor.when}</span>
              </p>
              {honor.detail && <p className="roles-body">{honor.detail}</p>}
            </li>
          ))}
        </ul>
      </Ticket>
      <SceneNote>The billboards are my photographs, shot on a Fujifilm X-T30 II.</SceneNote>
    </Stop>
  );
}
