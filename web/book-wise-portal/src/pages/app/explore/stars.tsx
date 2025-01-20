export function Stars({ rateAverage }: { rateAverage: number }) {
  return (
    <div className="flex items-center gap-1 mt-4">
      {[...Array(5)].map((_, i) => {
        const fillPercentage = Math.max(0, Math.min(1, rateAverage - i)); // Preenchimento da estrela entre 0 e 1
        const gradientId = `grad-${i}-${rateAverage}`; // Identificador único
        return (
          <svg
            key={i}
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={gradientId}>
                <stop offset={`${fillPercentage * 100}%`} stopColor="#8381D9" />
                <stop offset={`${fillPercentage * 100}%`} stopColor="#4B5563" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#${gradientId})`}
              d="M12 2.5c.6 0 1.1.3 1.4.8l1.8 3.7c.2.4.6.7 1 .8l4.1.6c1 .1 1.4 1.4.7 2.1l-3 2.9c-.3.3-.4.8-.3 1.2l.7 4c.2 1-.9 1.7-1.7 1.3l-3.6-1.9a1.5 1.5 0 0 0-1.4 0l-3.6 1.9c-.8.4-1.9-.3-1.7-1.3l.7-4c.1-.4 0-.9-.3-1.2l-3-2.9c-.7-.7-.3-2 .7-2.1l4.1-.6c.4-.1.8-.4 1-.8l1.8-3.7c.2-.5.7-.8 1.3-.8z"
            />
          </svg>
        );
      })}
    </div>
  );
}
