import "./orbit.css";

export default function OrbitParticles({ count = 20 }) {
  const particles = Array.from({ length: count });

  return (
    <div className="orbit-particles" aria-hidden="true">
      <div className="orbit-particles__glow" />
      <div className="orbit-particles__ring">
        {particles.map((_, index) => {
          const angle = (360 / count) * index;
          const colorClass = index % 3 === 0 ? "is-cyan" : index % 2 === 0 ? "is-green" : "is-orange";

          return (
            <span
              className={`orbit-particles__dot ${colorClass}`}
              key={index}
              style={{
                "--angle": `${angle}deg`,
                "--delay": `${index * -0.12}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
