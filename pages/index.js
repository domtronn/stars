/** @jsx jsx */
import Head from 'next/head'
import styled from '@emotion/styled'
import { jsx, keyframes } from '@emotion/core'

import { useRef, useState, useEffect, forwardRef } from 'react'
import { chunk, zip } from '../utils/arr'

import { FiPause, FiPlay, FiFastForward } from 'react-icons/fi'

const mq = [768, 990].map(bp => `@media (min-width: ${bp}px)`)

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 }
})

const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 }
})

const zoom = keyframes({
  from: { opacity: 0, transform: `translateZ(${0}px) scale(0.5)` },
  '30%': { opacity: 1 },
  '80%': { opacity: 1 },
  to: { opacity: 0, transform: `translateZ(${-800}px) scale(4)` }
})

const Button = styled.button(
  {
    transition: 'all 0.4s ease-in-out',
    outline: 'none',
    ':hover': {
      outline: 'none',
      cursor: 'pointer',
      borderColor: 'white',
      svg: { stroke: 'white' }
    },
    ':active': { outline: 'none' },
    ':focus': { outline: 'none' },
    svg: { stroke: '#81878e', strokeWidth: 2, width: '100%', height: '100%', transition: 'all 0.4s ease-in-out' },
    background: 'none',
    border: '2px solid #81878e',
    borderRadius: '50%',
    width: 52,
    height: 52,
    padding: 8
  },
  ({ active }) => ({
    svg: { stroke: active ? '#c6c8cb' : '#81878e' },
    borderColor: active ? '#c6c8cb' : '#81878e'
  })
)

const Body = styled.div(
  {
    display: 'flex',
    flexDirection: 'column',
    opacity: 0,
    animation: `${fadeIn} 1.8s 0.2s ease-in forwards`,
    background: 'radial-gradient(circle at 50% 120%, #1a2532 15%, #090a0f 60%, #090a0f)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
)

const Star = styled.circle()
const StarLayer = styled.svg(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
)

const ButtonContainer = styled.div(
  {
    transform: 'translateZ(-50px)',
    zIndex: 20,
    display: 'flex',
    justifyContent: 'space-between',
    width: 240,
    margin: '0 auto'
  }
)

const StarH1 = styled.h1(
  {
    width: '100%',
    opacity: 0,
    animation: `${fadeIn} 0.8s 0.5s ease-in forwards`,
    background: '-webkit-linear-gradient(#1a2532, #fff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    transform: 'translateZ(-100px)',
    textAlign: 'center',
    margin: '20% auto 0',
    fontSize: 54,
    [mq[1]]: { fontSize: 54 },
    [mq[0]]: { fontSize: 96 },
    fontWeight: 100,
    fontFamily: `'Monoton', cursive;`,
    color: 'white'
  }
)

const repeatMap = zip([-1000, 0, 1000], [-1000, 0, 1000])
const StarField = forwardRef((
  { stars, data, speed, className, animate = true, scaleF = () => {} },
  ref
) => (
  <div
    className={className}
    ref={ref}
  >
    {
      chunk(data, stars)
        .map((layer, i, layers) => (
          <StarLayer
            id={`layer-${scaleF(i + 1)}`}
            viewBox='0 0 1000 1000'
            css={{
              overflow: 'visible',

              opacity: animate ? 0 : 1,
              animation: animate ? `${zoom} ${speed}s ease-in infinite` : '',
              animationDelay: `${i * (speed / layers.length)}s`,
              transform: animate ? null : `translateZ(-${(i + 1) * 100}px)`,
              transformOrigin: '50% 50%'
            }}
            key={i}
          >
            <defs>
              <radialGradient id={`star-${i}`} cx='50%' cy='50%' r='50%'>
                <stop stopColor='#fff' offset='0%' />
                <stop stopColor='transparent' offset='100%' />
              </radialGradient>
            </defs>

            {layer.map(([x, y, r], j) => (
              repeatMap.map(([ox, oy], k) => (
                <Star
                  fill={`url("#star-${i}")`}
                  key={i + j + k}
                  r={scaleF(i)}
                  cx={x + ox}
                  cy={y + oy}
                />
              ))
            ))}
          </StarLayer>
        ))
    }
  </div>
))

const Home = ({ data, stars }) => {
  const body = useRef(null)
  const [fade, setFade] = useState('in')
  const [animate, setAnimate] = useState(true)
  const [speed, setSpeed] = useState(8)

  const setTransition = (cb) => () => {
    setFade('out')
    setTimeout(() => {
      setFade('in')
      cb()
    }, 500)
  }

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
    <Body>
      <Head>
        <title>Stars</title>
        <link href='https://fonts.googleapis.com/css2?family=Monoton&display=swap' rel='stylesheet' />
        <link rel='icon' href='/favicon.ico' />
        <style>{'body { background-color: #090a0f; }'}</style>
      </Head>

      <StarH1>STARS</StarH1>
      <br />

      <StarField
        ref={body}
        css={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 5000,
          animation: fade === 'in'
            ? `${fadeIn} 500ms ease-in`
            : `${fadeOut} 500ms ease-out`
        }}
        data={data}
        stars={stars}
        speed={speed}
        animate={animate}
        scaleF={animate ? _ => 2 : i => i}
      />

      <ButtonContainer>
        <Button
          active={!animate}
          onClick={setTransition(() => {
            setAnimate(false)
          })}
        >
          <FiPause />
        </Button>
        <Button
          active={animate && speed === 8}
          onClick={setTransition(() => {
            setAnimate(true)
            setSpeed(8)
          })}
        >
          <FiPlay />
        </Button>
        <Button
          active={animate && speed !== 8}
          onClick={setTransition(() => {
            setAnimate(true)
            setSpeed(2)
          })}
        >
          <FiFastForward />
        </Button>
      </ButtonContainer>

    </Body>
  )
}

export default Home

export async function getStaticProps (ctx) {
  const layers = 6
  const stars = 120
  const minr = 100

  const pre = new Date()
  const data = Array(layers * stars)
    .fill()
        .map(_ => {
          const r = minr + (Math.random() * (750 - minr))
          const theta = 2 * Math.PI * Math.random()

          return [
            (r * Math.cos(theta)) + 500,
            (r * Math.sin(theta)) + 500,
            1
          ]
        })

  console.log(`Data gen took: ${new Date() - pre}ms`)
  console.log(JSON.stringify(data))

  return { props: { data, stars } }
}
