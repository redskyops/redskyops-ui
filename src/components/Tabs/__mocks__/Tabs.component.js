import React from 'react'

type TypeProps = {
  children: React.ChildrenArray<React.Element>,
}

export const Tabs = (props: TypeProps) => {
  return <div className="Tabs_mock">{props.children}</div>
}

export default Tabs
