import { ChicagoTime } from "@/components/fx/ChicagoTime";
import { Magnetic } from "@/components/fx/Magnetic";
import { Stop } from "@/components/ride/Stop";
import { links, site } from "@/lib/site";

/** Stop 0: the car at the kerb at sunset, the name as the cover line. */
export function PickupStop() {
  return (
    <Stop id="pickup" className="stop-hero">
      <h1 className="cover cover-hero" aria-label={site.name}>
        <span className="cover-line">
          <span>Sameer</span>
        </span>
        <span className="cover-line">
          <span>Akhtar</span>
        </span>
      </h1>

      <div className="hero-foot">
        <div className="hero-copy">
          <p className="hero-role">Software engineer and founder in Chicago.</p>
          <p className="lede mt-3">
            I build AI features and real-time systems. After nearly two years on dispatch
            integration at a limo company I founded{" "}
            <a href={links.renaro} target="_blank" rel="noopener noreferrer" className="link">
              Renaro
            </a>{" "}
            to build the dispatch software myself. In 2026 I interned at Quantum Metric, where I
            owned AI Brand Discovery from design to production launch.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href={`mailto:${site.email}`} className="btn btn-primary">
                Email me
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={site.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Résumé
              </a>
            </Magnetic>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet ml-2 text-[0.9375rem]"
            >
              GitHub
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet text-[0.9375rem]"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <p className="hero-status">
          <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-accent" aria-hidden />
          <span>
            Open to 2027 new-grad roles, remote or in Chicago. <ChicagoTime />
          </span>
        </p>
      </div>
      <p className="hero-cue" aria-hidden="true">
        Scroll to start the ride
      </p>
    </Stop>
  );
}
