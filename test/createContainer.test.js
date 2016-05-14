import assert from 'assert'
import React, { Component } from 'react'
import TestUtils from 'react-addons-test-utils'
import { Store } from 'amelisa'
import jsdom from 'mocha-jsdom'
import { RootComponent, createContainer } from '../src'
import { renderToStaticMarkup } from '../src/server'
import { getStorage, collectionName, field, value, sleep } from './util'

let storage
let store
let model
let changeUserQueryForTestComponent

class Counter extends Component {
  render () {
    return <div>{this.props.count}</div>
  }
}

class TestComponent extends Component {

  state = {
    userQuery: {}
  }

  componentWillMount () {
    changeUserQueryForTestComponent = this.changeUserQuery
  }

  changeUserQuery = () => {
    let { resubscribe } = this.props // eslint-disable-line

    this.setState({
      userQuery: {[field]: value}
    }, resubscribe)
    // resubscribe({
    //   users: ['users', {[field]: value}]
    // })
  }

  subscribe () {
    let { userQuery } = this.state

    return {
      users: ['users', userQuery]
    }
  }

  render () {
    let { users } = this.props // eslint-disable-line

    return <Counter count={users.length} />
  }
}

let Container = createContainer(TestComponent)

class Root extends RootComponent {

  render () {
    return <Container />
  }
}

describe('createContainer', () => {
  jsdom()

  beforeEach(async () => {
    storage = await getStorage()
    store = new Store({storage})
    await store.init()
    model = store.createModel()

    await Promise.all([
      model.add(collectionName, {[field]: value}),
      model.add(collectionName, {[field]: 'Petr'}),
      model.add(collectionName, {[field]: 'Vasya'}),
      model.add(collectionName, {[field]: 'Kostya'}),
      model.add(collectionName, {[field]: 'Misha'})
    ])
  })

  it('should subscribe', async () => {
    let html = await renderToStaticMarkup(Root, {model})

    assert(html)
    assert.equal(typeof html, 'string')
    assert.equal(html, '<div>5</div>')
  })

  // TODO: fix rerender
  it('should resubscribe', async () => {
    let renderedComponent = TestUtils.renderIntoDocument(<Root model={model} />)
    await sleep(20)
    let counter = TestUtils.findRenderedComponentWithType(renderedComponent, Counter)
    assert.equal(counter.props.count, 5)

    assert(changeUserQueryForTestComponent)

    changeUserQueryForTestComponent()
    await sleep(20)
    assert.equal(counter.props.count, 1)
  })
})
