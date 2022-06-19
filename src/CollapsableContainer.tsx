import React from 'react';
import useCollapse from 'react-collapsed';
import { FunctionComponent } from 'react';

export interface CollapsableContainerProps {
  decode: string;
  containerClassName: string;
  decodeClassName: string;
  children: JSX.Element;
}
;
export const CollapsableContainer: FunctionComponent<CollapsableContainerProps> = ({ decode, containerClassName, decodeClassName, children }) => {
  const { getCollapseProps, getToggleProps } = useCollapse();

  return (
    <div className={containerClassName} {...getToggleProps()}>
      <div className={decodeClassName}>
        {decode}
      </div>

      <div {...getCollapseProps()}>
        {children}
      </div>
    </div>
  );
};
