import StaticImages from './components/StaticImages'

const Page = async () => {
  const data = await getData()

  return (
    <main className='relative w-full h-full'>
      <div className='w-full max-w-7xl px-4 h-full mx-auto'>
        <div className='flex flex-col gap-4 mt-12'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl text-gray-100 font-extrabold'>Ленсмейстер</h1>
          <p className='text-sm sm:text-md lg:text-lg xl:text-xl sm:max-w-[75%] text-gray-500'>Приоткройте занавес миров: встречайте визуальные шедевры, <span className='xs:whitespace-nowrap'>где сливаются творчество и мастерство объектива.</span></p>
        </div>
        <div className='mt-12 xl:mt-16'>
          <StaticImages data={data}  />
        </div>
      </div>
    </main>
  )
}

async function getData() {
  const res = await fetch("http://localhost:3000/api/images", { next: { revalidate: 60 } })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  const imageData = await res.json()
  return imageData
}

export default Page