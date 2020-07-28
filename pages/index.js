/** @jsx jsx */
import Head from 'next/head'
import styled from '@emotion/styled'
import { jsx, keyframes } from '@emotion/core'

import { useRef, useEffect } from 'react'
import { chunk, zip } from '../utils/arr'

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 }
})

const zoom = keyframes({
  from: { opacity: 0, transform: `translateZ(${0}px) scale(0.5)` },
  '10%': { opacity: 1 },
  '90%': { opacity: 1 },
  to: { opacity: 0, transform: `translateZ(${-400}px) scale(2)` }
})

const Body = styled.div(
  {
    opacity: 0,
    animation: `${fadeIn} 1.8s 0.2s ease-in forwards`,
    background: 'radial-gradient(circle at 50% 120%, #1a2532 15%, #090a0f 60%, #090a0f)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    perspective: 5000
  }
)

const Star = styled.circle()

const StarLayer = styled.svg(
  {
    overflow: 'visible',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
)

const StarH1 = styled.h1(
  {
    opacity: 0,
    animation: `${fadeIn} 0.8s 0.5s ease-in forwards`,
    background: '-webkit-linear-gradient(#1a2532, #fff)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    transform: 'translateZ(-100px)',
    textAlign: 'center',
    margin: '20% auto',
    fontSize: 96,
    fontWeight: 100,
    fontFamily: `'Monoton', cursive;`,
    color: 'white'
  }
)

const repeatMap = zip([-1000, 0, 1000], [-1000, 0, 1000])
const StarField = ({ stars, data, scaleF = () => {} }) => {
  return chunk(data, stars)
    .map((layer, i, layers) => (
      <StarLayer
        id={`layer-${scaleF(i + 1)}`}
        viewBox='0 0 1000 1000'
        css={{
          opacity: 0,
          animation: `${zoom} 4s ease-in infinite`,
          animationDelay: `${i * (4 / layers.length)}s`,
          transformOrigin: '50% 30%'
        }}
        key={i}
      >
        <defs>
          <radialGradient id='star' cx='50%' cy='50%' r='50%'>
            <stop stop-color='#fff' offset='0%' />
            <stop stop-color='transparent' offset='100%' />
          </radialGradient>
        </defs>
        {layer.map(([x, y], j) => (
          repeatMap.map(([ox, oy], k) => (
            <Star
              fill='url("#star")'
              key={i + j + k}
              r={2}
              cx={x + ox}
              cy={y + oy}
            />
          ))
        ))}
      </StarLayer>
    ))
}

const Home = ({ data, stars }) => {
  const body = useRef(null)

  useEffect(() => {
    document.addEventListener('mousemove', e => {
      if (!body.current) return

      body
        .current
        .style
        .perspectiveOrigin = `${e.clientX}px ${e.clientY}px`
    })
  }, [])

  return (
    <Body
      ref={body}
    >
      <Head>
        <title>Stars</title>
        <link href='https://fonts.googleapis.com/css2?family=Monoton&display=swap' rel='stylesheet' />
        <link rel='icon' href='/favicon.ico' />
        <style>{'body { background-color: #090a0f; }'}</style>
      </Head>

      <StarH1>STARS</StarH1>

      <StarField
        data={data}
        stars={stars}
        scaleF={i => i / 4}
      />
    </Body>
  )
}

export default Home

export async function getStaticProps (ctx) {
  const layers = 12
  const stars = 50

  const pre = new Date()
  const data = Array(layers * stars)
    .fill()
    .map(_ => [
      Math.round(Math.random() * 1000),
      Math.round(Math.random() * 1000)
    ])

  console.log(`Data gen took: ${new Date() - pre}ms`)

  return { props: { data, stars } }
}
