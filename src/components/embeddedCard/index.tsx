import { Suspense } from "react"

export default function EmbeddedCard({ url, provider }: any) {
  const code = url ? url : (!provider || provider == "youtube") ? `<iframe
  src="https://www.youtube.com/embed/pj8SoTZbCTE?si=IL_0JIiqpbsbC3xL"
  title="YouTube video player"
  allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
></iframe>`: `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@codin.s/video/7180310040669080838" data-video-id="7180310040669080838" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@codin.s" href="https://www.tiktok.com/@codin.s?refer=embed">@codin.s</a> Coding Apple(ios) Calculator - No Talking - ASMR Programming <a title="asmr" target="_blank" href="https://www.tiktok.com/tag/asmr?refer=embed">#asmr</a> <a title="asmrcoding" target="_blank" href="https://www.tiktok.com/tag/asmrcoding?refer=embed">#asmrcoding</a> <a title="programmer" target="_blank" href="https://www.tiktok.com/tag/programmer?refer=embed">#programmer</a> <a target="_blank" title="♬ оригинальный звук  - Codin" href="https://www.tiktok.com/music/оригинальный-звук-Codin-7180310535107234565?refer=embed">♬ оригинальный звук  - Codin</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>`

  return (
    <div className="w-full mb-4 flex justify-center">
      <div dangerouslySetInnerHTML={{ __html: code }}></div>
    </div>
  );
}
