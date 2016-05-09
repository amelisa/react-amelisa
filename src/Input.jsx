import React, { Component, PropTypes, cloneElement } from 'react'

class Input extends Component {

  constructor (props, context) {
    super()

    let { collectionName, docId, field } = props
    let value = context.model.get(collectionName, docId, field)

    this.state = {
      value
    }
  }

  static contextTypes = {
    model: PropTypes.object
  };

  static propTypes = {
    type: PropTypes.string,
    collectionName: PropTypes.string,
    docId: PropTypes.string,
    field: PropTypes.string,
    children: PropTypes.any
  };

  static defaultProps = {
    type: 'input'
  };

  componentDidMount () {
    let { collectionName, docId } = this.props
    let doc = this.context.model.doc(collectionName, docId)

    doc.on('stringInsert', this.onStringInsert)
    doc.on('stringRemove', this.onStringRemove)
  }

  componentWillUnmount () {
    let { collectionName, docId } = this.props
    let doc = this.context.model.doc(collectionName, docId)

    doc.removeListener('stringInsert', this.onStringInsert)
    doc.removeListener('stringRemove', this.onStringRemove)
  }

  onStringInsert = (eventField, index, howMany) => {
    let { collectionName, docId, field } = this.props
    if (eventField !== field) return

    let value = this.context.model.get(collectionName, docId, field)
    let { input } = this.refs
    if (input.refs && input.refs.input) input = input.refs.input

    let { selectionStart, selectionEnd } = input
    if (selectionStart > index + howMany) selectionStart = selectionStart + howMany
    if (selectionEnd > index + howMany) selectionEnd = selectionEnd + howMany

    this.setState({
      value
    })
    input.setSelectionRange(selectionStart, selectionEnd)
  };

  onStringRemove = (eventField, index, howMany) => {
    let { collectionName, docId, field } = this.props
    if (eventField !== field) return

    let value = this.context.model.get(collectionName, docId, field)
    let { input } = this.refs
    if (input.refs && input.refs.input) input = input.refs.input

    let { selectionStart, selectionEnd } = input
    if (selectionStart > index) selectionStart = selectionStart - howMany
    if (selectionEnd > index) selectionEnd = selectionEnd - howMany

    this.setState({
      value
    })
    input.setSelectionRange(selectionStart, selectionEnd)
  };

  render () {
    let { type, children } = this.props
    let { value } = this.state

    if (children) {
      return cloneElement(children, {
        ref: 'input',
        value,
        onChange: this.onChange
      })
    }

    if (type === 'textarea') {
      return (
        <textarea
          {...this.props}
          ref='input'
          value={value}
          onChange={this.onChange}
        />
      )
    }

    return (
      <input
        {...this.props}
        ref='input'
        value={value}
        onChange={this.onChange}
      />
    )
  }

  onChange = (event) => {
    let { collectionName, docId, field } = this.props
    let { value } = event.nativeEvent.target
    this.context.model.stringDiff([collectionName, docId, field], value)
  }
}

export default Input
