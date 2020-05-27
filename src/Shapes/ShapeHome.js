import React from 'react'
import * as ReactKonva from 'react-konva'
import { useImmerReducer } from 'use-immer'

import Layers from './Layers'

import './ShapeHome.css'

const ADD_TEXT = 'ADD_TEXT'
const ADD_CIRCLE = 'ADD_CIRCLE'
const UPDATE_LAYER = 'UPDATE_LAYER'
const UPDATE_LAYERS = 'UPDATE_LAYERS'
const STAGE_WIDTH = window.innerWidth - 200
const STAGE_HEIGHT = window.innerHeight - 60

const AppContext = React.createContext()

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function GUIControl({ label, type }) {
  const dispatch = React.useContext(AppContext)
  return <button onClick={() => dispatch({ type })}>Add {label}</button>
}

function GUI({ dispatch, style }) {
  return (
    <div
      style={{
        ...style,
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: 'minmax(min-content, max-content)',
        gridGap: 8,
        padding: 16,
        backgroundColor: '#3a3a47',
        color: 'white',
      }}
    >
      <GUIControl label="Text" type={ADD_TEXT} />
      <GUIControl label="Circle" type={ADD_CIRCLE} />
    </div>
  )
}

function Text(props) {
  const ref = React.useRef()
  const dragBounds = ({ x, y }) => {
    const width = ref.current.getWidth()
    const height = ref.current.getHeight()
    return {
      x: Math.min(STAGE_WIDTH - width, Math.max(0, x)),
      y: Math.min(STAGE_HEIGHT - height, Math.max(0, y)),
    }
  }
  return (
    <ReactKonva.Text
      ref={ref}
      draggable
      dragBoundFunc={dragBounds}
      text="Text"
      {...props}
    />
  )
}

function Circle(props) {
  const ref = React.useRef()
  const dragBounds = ({ x, y }) => {
    const radius = ref.current.getRadius()
    return {
      x: Math.min(STAGE_WIDTH - radius, Math.max(radius, x)),
      y: Math.min(STAGE_HEIGHT - radius, Math.max(radius, y)),
    }
  }
  return (
    <ReactKonva.Circle
      ref={ref}
      draggable
      dragBoundFunc={dragBounds}
      x={50}
      y={50}
      radius={50}
      {...props}
    />
  )
}

function reducer(draft, action) {
  switch (action.type) {
    case ADD_TEXT:
      return void draft.layers.push({
        id: `text-${Math.random() * Math.random()}`,
        type: Text,
        name: 'Text',
      })
    case ADD_CIRCLE:
      return void draft.layers.push({
        id: `circle-${Math.random() * Math.random()}`,
        type: Circle,
        name: 'Circle',
        fill: getRandomColor(),
      })
    case UPDATE_LAYER:
      draft.layers.forEach(layer => {
        if (layer.id === action.id) {
          Object.assign(layer, action.props)
        }
      })
      return
    case UPDATE_LAYERS:
      draft.layers = action.layers
      return
    default:
      return draft
  }
}

function ShapeHome() {
  const [state, dispatch] = useImmerReducer(reducer, {
    layers: [],
  })
  console.log(JSON.stringify(state.layers, null, 2))
  return (
    <AppContext.Provider value={dispatch}>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: '60px 1fr',
          gridTemplateColumns: '200px 1fr',
        }}
      >
        <GUI
          dispatch={dispatch}
          style={{ gridColumnStart: 1, gridColumnEnd: 3 }}
        />
        <Layers
          layers={state.layers}
          onLayersUpdate={layers => dispatch({ type: UPDATE_LAYERS, layers })}
        />
        <div style={{ gridRowStart: 2 }}>
          <ReactKonva.Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
            <ReactKonva.Layer>
              {state.layers.map(({ type, id, ...layerProps }, index) =>
                React.createElement(type, {
                  key: index,
                  onDragEnd: e => {
                    dispatch({
                      type: UPDATE_LAYER,
                      id,
                      props: {
                        x: e.target.x(),
                        y: e.target.y(),
                      },
                    })
                  },
                  ...layerProps,
                }),
              )}
            </ReactKonva.Layer>
          </ReactKonva.Stage>
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default ShapeHome;
