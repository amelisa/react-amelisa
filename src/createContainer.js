import React, { Component, PropTypes } from 'react'
import loading from './loading'
import { isServer, deepClone, fastEqual } from './util'

function createContainer (Child, ChildLoading) {
  if (!Child.prototype.subscribe) {
    throw new Error(`${Child.name} should has 'subscribe' method for 'createContainer'`)
  }

  class Container extends Component {

    static contextTypes = {
      model: PropTypes.object
    }

    static propTypes = {
      hasResults: PropTypes.bool,
      onFetch: PropTypes.func
    }

    static isContainer = true;

    static displayName = `${Child.name} Container`;

    constructor (props) {
      super()
      let { hasResults } = props
      this.state = {
        hasResults
      }
      this.mounted = false
    }

    componentWillMount () {
      let subscribeData = this.getSubscribeData(this.props)
      this.setSubscription(subscribeData)
      this.subscribeData = subscribeData
    }

    componentDidMount () {
      this.mounted = true
    }

    componentWillUnmount () {
      this.mounted = false
      if (!this.subscription) return

      this.subscription.unsubscribe()
    }

    componentWillReceiveProps (nextProps) {
      let subscribeData = this.getSubscribeData(nextProps)
      if (!fastEqual(subscribeData, this.subscribeData)) {
        this.resubscribe(subscribeData)
      }
    }

    getSubscribeData (props) {
      let { context } = this
      let { component } = this.refs

      // before initial rendering, component does not exists,
      // so we create it with constructor.
      // It should has the same state as after initial rendering
      if (!component) component = new Child(props, context)

      let { state } = component
      return component.subscribe.call({props, state, context})
    }

    resubscribe = (nextSubscribeData) => {
      if (!nextSubscribeData) {
        nextSubscribeData = this.getSubscribeData(this.props)
      }

      this.setDataKeysAndRawSubscribes(nextSubscribeData)
      this.subscription
        .changeSubscribes(this.rawSubscribes)
        .then(() => {
          this.refresh()
        })
      this.subscribeData = nextSubscribeData
    }

    setDataKeysAndRawSubscribes (subscribeData) {
      this.dataKeys = []
      this.rawSubscribes = []

      for (let dataKey in subscribeData) {
        this.dataKeys.push(dataKey)
        this.rawSubscribes.push(subscribeData[dataKey])
      }
    }

    setSubscription (subscribeData) {
      let { onFetch } = this.props
      let { hasResults } = this.state
      let { model } = this.context

      this.setDataKeysAndRawSubscribes(subscribeData)

      // server rendering
      if (isServer && onFetch && !hasResults) { // eslint-disable-line
        let promise = model
            .subscribe(...this.rawSubscribes)
            .then((subscription) => {
              this.subscription = subscription

              return this.getPropsFromSubscription(subscription)
            })

        onFetch(promise) // eslint-disable-line

        return promise
      }

      return model
        .subscribe(...this.rawSubscribes)
        .then((subscription) => {
          this.subscription = subscription

          if (!isServer) {
            subscription.on('change', () => {
              this.refresh()
            })
          }

          this.refresh()
        })
    }

    refresh () {
      if (!this.mounted) return
      let { hasResults } = this.state

      if (hasResults) {
        this.forceUpdate()
      } else {
        this.setState({
          hasResults: true
        })
      }
    }

    getPropsFromSubscription (subscription) {
      let subscribes = subscription.subscribes

      let dataProps = {}
      for (let i = 0; i < subscribes.length; i++) {
        let subscribe = subscribes[i]
        let dataKey = this.dataKeys[i]
        let options = this.subscribeData[dataKey][2]
        let data = subscribe.get(options)

        dataProps[dataKey] = deepClone(data)
      }

      let utilProps = {
        resubscribe: this.resubscribe
      }
      return {...dataProps, ...(this.props || {}), ...utilProps}
    }

    render () {
      let { hasResults } = this.state

      if (!hasResults) return this.renderLoading()

      let props = this.props
      if (this.subscription) {
        props = this.getPropsFromSubscription(this.subscription)
      }

      return <Child ref='component' {...props} />
    }

    renderLoading () {
      if (ChildLoading) return <ChildLoading />

      let Loading = loading.get()
      if (Loading) return <Loading />

      return null
    }
  }

  return Container
}

export default createContainer
