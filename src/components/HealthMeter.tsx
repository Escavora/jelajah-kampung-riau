import { Sprout, TreeDeciduous } from 'lucide-react'

/**
 * Meter Kampung Sehat (design.md 7.9): batang plus ikon pohon yang ikut tumbuh atau layu.
 * Isian emas, bukan hijau, supaya tidak tertukar dengan warna kategori Alam.
 */
export function HealthMeter({ value }: { value: number }) {
  const Tree = value >= 50 ? TreeDeciduous : Sprout
  const layu = value < 30
  return (
    <div className="flex items-center gap-4">
      <span className="font-display text-sub whitespace-nowrap text-marun-700">Kampung Sehat</span>
      <div
        role="meter"
        aria-label="Kampung Sehat"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className="relative h-7 flex-1 overflow-hidden rounded-full border-[3px] border-marun-700 bg-gading-200"
      >
        <div
          className="h-full rounded-full bg-emas-400 transition-[width] duration-[400ms] ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
      <Tree
        aria-hidden
        size={48}
        strokeWidth={2.5}
        className={`shrink-0 origin-bottom transition-transform duration-[400ms] ${layu ? 'text-kabut-400' : 'text-alam-700'}`}
        style={{ transform: `scale(${0.75 + value / 300}) rotate(${layu ? -12 : 0}deg)` }}
      />
    </div>
  )
}
