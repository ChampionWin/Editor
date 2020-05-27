import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const grid = 8

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export default ({ layers, onLayersUpdate }) => {
  return (
    <DragDropContext
      onDragEnd={result => {
        if (!result.destination) {
          return
        }
        onLayersUpdate(
          reorder(layers, result.source.index, result.destination.index),
        )
      }}
    >
      <div
        style={{
          gridRowStart: 2,
          display: 'grid',
          gridAutoRows: 'minmax(min-content, max-content)',
          gridGap: 16,
          padding: 16,
          backgroundColor: '#f0f0f0',
        }}
      >
        <div style={{ fontSize: 11, textTransform: 'uppercase' }}>Layers:</div>
        <Droppable droppableId="droppable">
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                display: 'grid',
                gridAutoRows: 'minmax(min-content, max-content)',
                gridGap: 8,
              }}
            >
              {layers.map((layer, index) => (
                <Draggable key={layer.id} draggableId={layer.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: 8,
                        background: snapshot.isDragging
                          ? 'lightgreen'
                          : 'lightgrey',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {layer.name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}
