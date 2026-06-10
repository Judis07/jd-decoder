const Hero = () => {
  return (
    <section className="mb-12 text-left border-l-2 border-[#30363D] pl-6">
      <div className="font-mono text-xs text-[#8B949E] mb-2">// tool</div>
      <h1 className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[#F0F6FC] mb-2">
        Cut through the <span className="text-[#D4933A]">noise</span>
        <br />
        in any job description
      </h1>
      <p className="text-[#8B949E] text-xs sm:text-sm max-w-xl leading-relaxed">
        Paste a JD. Get what actually matters — real requirements,{" "}
        <span className="text-[#D4933A]">red flags</span>, seniority reality
        check, and what to study before you apply.
      </p>
    </section>
  );
};

export default Hero;
