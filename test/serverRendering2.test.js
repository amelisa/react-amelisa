import assert from 'assert'
import React, { Component } from 'react'
import { Store } from 'amelisa'
import { RootComponent, createContainer } from '../src'
import { renderToStaticMarkup } from '../src/server'
import { getStorage, collectionName, field, value } from './util'

let storage
let store
let model

class TestComponent2 extends Component {

  subscribe () {
    return {
      users: ['users', {name: 'Petr'}]
    }
  }

  render () {
    let { users } = this.props // eslint-disable-line
    let user = users[0]
    let name = user ? user.name : 'no'

    let components = [<div key='1'>{name}</div>]

    return (
      <div className='petr'>
        {components}
      </div>
    )
  }
}

let Container2 = createContainer(TestComponent2)

class TestComponent extends Component {

  subscribe () {
    return {
      users: ['users', {name: 'Ivan'}]
    }
  }

  render () {
    let { users, children } = this.props // eslint-disable-line
    let user = users[0]
    let name = user ? user.name : 'no'

    let components = [<div key='1'>{name}</div>]

    return (
      <div className='ivan'>
        {components}
        {children}
      </div>
    )
  }
}

let Container = createContainer(TestComponent)

class Root extends RootComponent {

  render () {
    return (
      <div className='root'>
        <Container key='2'>
          <Container2 key='3'/>
        </Container>
      </div>
    )
  }
}

describe.skip('serverRendering2', () => {
  beforeEach(async () => {
    storage = await getStorage()
    store = new Store({storage})
    await store.init()
    model = store.createModel()

    await Promise.all([
      model.add(collectionName, {[field]: value}),
      model.add(collectionName, {[field]: 'Petr'})
    ])
  })

  it('should render to string with children', async () => {
    let html = await renderToStaticMarkup(Root, {model})

    assert(html)
    assert.equal(typeof html, 'string')
    assert(html.indexOf('ivan"><div>Ivan') > -1)
    assert(html.indexOf('petr"><div>Petr') > -1)
  })
})
