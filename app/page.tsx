'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Logo = dynamic(() => import('@/components/canvas/Welsh').then((mod) => mod.Logo), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  return (
    <>
      <div className='relative mx-auto flex w-full flex-col flex-wrap items-center md:flex-row'>
        {/* jumbo */}
        <div className='absolute z-10 flex w-full flex-col items-start justify-center p-4 text-center text-black md:w-2/5 md:text-left'>
          <p className='w-full uppercase'>Community Run</p>
          <h1 className='my-4 text-5xl font-bold leading-tight'>Welshcorgicoin</h1>
          <p className='mb-8 text-2xl leading-normal'>The cutest token in the Bitcoin ecosystem.</p>
        </div>

        <div className='w-full text-center'>
          <View className='flex h-screen w-full flex-col items-center justify-center'>
            <Suspense fallback={null}>
              <Logo scale={2} position={[0, -1.6, 0]} rotation={[0.0, -0.3, 0]} />
              <Common color={'#f6f6f6'} />
            </Suspense>
          </View>
        </div>
      </div>
    </>
  )
}
