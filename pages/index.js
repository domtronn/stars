/** @jsx jsx */
import Head from 'next/head'
import styled from '@emotion/styled'
import { jsx, keyframes } from '@emotion/core'

import { useRef, useState, useEffect, forwardRef } from 'react'
import { chunk, zip } from '../utils/arr'

import { FiPause, FiPlay, FiFastForward } from 'react-icons/fi'

/** ----- Config start */
const mq = [768, 990].map(bp => `@media (min-width: ${bp}px)`)
const VIEWBOX = 1000
const MINIMUM_RADIUS = 80
const STARS = 80
const LAYERS = 6
/** ----- Config end */

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
    position: 'relative',
    transition: 'all 0.4s ease-in-out',
    outline: 'none',
    ':hover': {
      outline: 'none',
      cursor: 'pointer',
      borderColor: 'transparent',
      svg: { fill: 'white' },
      'svg + svg': { stroke: 'white', fill: 'none' }
    },
    ':active': { outline: 'none' },
    ':focus': { outline: 'none' },
    svg: { transition: 'all 0.4s ease-in-out' },
    'svg + svg': { stroke: '#81878e', strokeWidth: 2, width: '100%', height: '100%' },
    background: 'none',
    border: '2px solid #81878e',
    borderRadius: '50%',
    width: 52,
    height: 52,
    padding: 8
  },
  ({ active }) => ({
    ':hover': {
      svg: { fill: active ? 'transparent' : 'white' },
      borderColor: active ? 'white' : 'transparent'
    },
    'svg + svg': { stroke: active ? '#c6c8cb' : '#81878e' },
    borderColor: active ? '#c6c8cb' : 'transparent'
  })
)

const Spinner = ({ fill, stroke, ...rest }) => (
  <svg
    css={{
      top: -9,
      left: -9,
      width: 66,
      height: 66,
      position: 'absolute',
      stroke: 'none',
      fill: 'rgba(0,0,0,0)'
    }}
    {...rest}
    version='1.1'
    viewBox='0 0 80 80'
  >

    <path
      d={
        [
          'M10,40c0,0,0-0.4,0-1.1c0-0.3,0-0.8,0-1.3c0-0.3,0-0.5,0-0.8c0-0.3,0.1-0.6,0.1-0.9c0.1-0.6,0.1-1.4,0.2-2.1',
          'c0.2-0.8,0.3-1.6,0.5-2.5c0.2-0.9,0.6-1.8,0.8-2.8c0.3-1,0.8-1.9,1.2-3c0.5-1,1.1-2,1.7-3.1c0.7-1,1.4-2.1,2.2-3.1',
          'c1.6-2.1,3.7-3.9,6-5.6c2.3-1.7,5-3,7.9-4.1c0.7-0.2,1.5-0.4,2.2-0.7c0.7-0.3,1.5-0.3,2.3-0.5c0.8-0.2,1.5-0.3,2.3-0.4l1.2-0.1',
          'l0.6-0.1l0.3,0l0.1,0l0.1,0l0,0c0.1,0-0.1,0,0.1,0c1.5,0,2.9-0.1,4.5,0.2c0.8,0.1,1.6,0.1,2.4,0.3c0.8,0.2,1.5,0.3,2.3,0.5',
          'c3,0.8,5.9,2,8.5,3.6c2.6,1.6,4.9,3.4,6.8,5.4c1,1,1.8,2.1,2.7,3.1c0.8,1.1,1.5,2.1,2.1,3.2c0.6,1.1,1.2,2.1,1.6,3.1',
          'c0.4,1,0.9,2,1.2,3c0.3,1,0.6,1.9,0.8,2.7c0.2,0.9,0.3,1.6,0.5,2.4c0.1,0.4,0.1,0.7,0.2,1c0,0.3,0.1,0.6,0.1,0.9',
          'c0.1,0.6,0.1,1,0.1,1.4C74,39.6,74,40,74,40c0.2,2.2-1.5,4.1-3.7,4.3s-4.1-1.5-4.3-3.7c0-0.1,0-0.2,0-0.3l0-0.4c0,0,0-0.3,0-0.9',
          'c0-0.3,0-0.7,0-1.1c0-0.2,0-0.5,0-0.7c0-0.2-0.1-0.5-0.1-0.8c-0.1-0.6-0.1-1.2-0.2-1.9c-0.1-0.7-0.3-1.4-0.4-2.2',
          'c-0.2-0.8-0.5-1.6-0.7-2.4c-0.3-0.8-0.7-1.7-1.1-2.6c-0.5-0.9-0.9-1.8-1.5-2.7c-0.6-0.9-1.2-1.8-1.9-2.7c-1.4-1.8-3.2-3.4-5.2-4.9',
          'c-2-1.5-4.4-2.7-6.9-3.6c-0.6-0.2-1.3-0.4-1.9-0.6c-0.7-0.2-1.3-0.3-1.9-0.4c-1.2-0.3-2.8-0.4-4.2-0.5l-2,0c-0.7,0-1.4,0.1-2.1,0.1',
          'c-0.7,0.1-1.4,0.1-2,0.3c-0.7,0.1-1.3,0.3-2,0.4c-2.6,0.7-5.2,1.7-7.5,3.1c-2.2,1.4-4.3,2.9-6,4.7c-0.9,0.8-1.6,1.8-2.4,2.7',
          'c-0.7,0.9-1.3,1.9-1.9,2.8c-0.5,1-1,1.9-1.4,2.8c-0.4,0.9-0.8,1.8-1,2.6c-0.3,0.9-0.5,1.6-0.7,2.4c-0.2,0.7-0.3,1.4-0.4,2.1',
          'c-0.1,0.3-0.1,0.6-0.2,0.9c0,0.3-0.1,0.6-0.1,0.8c0,0.5-0.1,0.9-0.1,1.3C10,39.6,10,40,10,40z'
        ].join('')
      }
    >
      <animateTransform
        attributeType='xml'
        attributeName='transform'
        type='rotate'
        from='0 40 40'
        to='360 40 40'
        dur='0.6s'
        repeatCount='indefinite'
      />
    </path>
  </svg>
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

const repeatMap = zip([-VIEWBOX, 0, VIEWBOX], [-VIEWBOX, 0, VIEWBOX])
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
            viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
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
          <Spinner />
          <FiPause />
        </Button>
        <Button
          active={animate && speed === 8}
          onClick={setTransition(() => {
            setAnimate(true)
            setSpeed(8)
          })}
        >
          <Spinner />
          <FiPlay />
        </Button>
        <Button
          active={animate && speed !== 8}
          onClick={setTransition(() => {
            setAnimate(true)
            setSpeed(2)
          })}
        >
          <Spinner />
          <FiFastForward />
        </Button>
      </ButtonContainer>

    </Body>
  )
}

export default Home

export async function getStaticProps (ctx) {
  const data = Array(LAYERS * STARS)
    .fill()
    .map(_ => {
      const r = MINIMUM_RADIUS + (Math.random() * (1000 - MINIMUM_RADIUS))
      const theta = 2 * Math.PI * Math.random()

      return [
        (r * Math.cos(theta)) + (VIEWBOX / 2), // Centre x point
        (r * Math.sin(theta)) + (VIEWBOX / 2), // Centre y point
        1
      ]
    })

  return { props: { data, stars: STARS } }
}
