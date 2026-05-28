type PlaybookCardProps = {};

export function PlaybookCard(props: PlaybookCardProps) {
  console.log('Rendering PlaybookCard with props: ', props);
  return (
    <div
      className="group w-80 h-[350px] p-5 text-white border-2 border-transparent rounded-lg flex flex-col        
  cursor-pointer origin-bottom-right transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] hover:rotate-[8deg]"
      style={{
        background: 'linear-gradient(#212121, #212121) padding-box, linear-gradient(145deg, transparent 35%, #e81cff, #40c9ff) border-box',
        border: '2px solid transparent',
      }}
    >
      <div className="flex-1">
        <div>
          <span className="font-semibold text-[#717171] mr-1">Article on</span>
          <span>29-June-2023</span>
        </div>
        <p className="text-2xl my-6 mb-4 font-semibold">Different ways to use CSS in React</p>
        <div className="flex gap-2">
          <span className="bg-[#e81cff] px-2 py-1 font-semibold uppercase text-xs rounded-full">React</span>
          <span className="bg-[#e81cff] px-2 py-1 font-semibold uppercase text-xs rounded-full">Css</span>
        </div>
      </div>
      <div className="font-semibold text-[#717171]">by Harsh Gupta</div>
    </div>
  );
}
