import assert from 'assert'
import React, { Component } from 'react'
import { Store } from 'amelisa'
import { RootComponent, createContainer } from '../src'
import { renderToStaticMarkup } from '../src/server'
import { getStorage, collectionName, docId, field, value } from './util'

let storage
let store
let model

class TestComponent extends Component {

  subscribe () {
    return {
      userId: ['_session', 'userId'],
      user: ['users', '1']
    }
  }

  render () {
    let { userId, user } = this.props // eslint-disable-line

    let components = [<div key='1'>{userId}</div>, <div key='2'>{user.name}</div>]

    return (
      <div className='ivan'>
        {components}
      </div>
    )
  }
}

let Container = createContainer(TestComponent)

class Root extends RootComponent {

  render () {
    let { children } = this.props // eslint-disable-line

    let components = [<div key='1'>Root</div>]

    return (
      <div className='root'>
        {components}
        {children}
      </div>
    )
  }
}

describe.skip('serverRendering4', () => {
  beforeEach(async () => {
    storage = await getStorage()
    store = new Store({storage})
    await store.init()
    model = store.createModel()

    let doc = {
      id: docId,
      [field]: value
    }

    await model.add(collectionName, doc)
  })

  it('should render to string local data', async () => {
    model.set(['_session.userId'], '123-456')
    let html = await renderToStaticMarkup(Root, {model}, <Container />)

    assert(html)
    assert.equal(typeof html, 'string')
    assert(html.indexOf('Ivan') > -1)
    assert(html.indexOf('123-456') > -1)
  })
})
