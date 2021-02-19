import React, { useState, useRef, useContext } from 'react';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons/ExclamationCircleFilled';
import InfoCircleFilled from '@ant-design/icons/InfoCircleFilled';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';
import CSSMotion from 'rc-motion';
import classNames from 'classnames';

import { ConfigContext } from '../config-provider';
import getDataOrAriaProps from '../_util/getDataOrAriaProps';
import ErrorBoundary from './ErrorBoundary';
import { replaceElement } from '../_util/reactNode';

const ALERT_SUCCESS = 'success' as const;
const ALERT_INFO = 'info' as const;
const ALERT_WARNING = 'warning' as const;
const ALERT_ERROR = 'error' as const;

type ALERT_TYPE =
  | typeof ALERT_SUCCESS
  | typeof ALERT_INFO
  | typeof ALERT_WARNING
  | typeof ALERT_ERROR;

const iconMapFilled = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
};

const iconMapOutlined = {
  success: CheckCircleOutlined,
  info: InfoCircleOutlined,
  error: CloseCircleOutlined,
  warning: ExclamationCircleOutlined,
};

export interface AlertProps {
  // Alert 风格类型
  type?: ALERT_TYPE;
  // Alert 是否可关闭
  closable?: boolean;
  // 自定义关闭按钮
  closeText?: React.ReactNode;
  // Alert 内容
  message: React.ReactNode;
  // Alert 辅助提示, 小号淡色字体
  description?: React.ReactNode;
  // Alert 关闭回调
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  // Alert 动画关闭后的回调
  afterClose?: () => void;
  // 是否现实辅助图标
  showIcon?: boolean;
  /** https://www.w3.org/TR/2014/REC-html5-20141028/dom.html#aria-role-attribute */
  role?: string;
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: string;
  // 顶部公告
  banner?: boolean;
  icon?: React.ReactNode;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

interface AlertInterface extends React.FC<AlertProps> {
  ErrorBoundary: typeof ErrorBoundary;
}

const Alert: AlertInterface = ({
  description,
  prefixCls: customizePrefixCls,
  message,
  banner,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onClick,
  afterClose,
  showIcon,
  closable,
  closeText,
  ...props
}) => {
  const [closed, setClosed] = useState<boolean>(false);
  const ref = useRef<HTMLElement>();
  const { getPrefixCls, direction } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('alert', customizePrefixCls);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    setClosed(true);
    props.onClose?.(e);
  };

  const getType: () => ALERT_TYPE = () => {
    const { type } = props;
    if (type !== undefined) {
      return type;
    }

    return banner ? ALERT_WARNING : ALERT_INFO;
  };

  const isClosable = closeText ? true : closable;
  const type = getType();

  const renderIconNode = () => {
    const { icon } = props;
    const iconType = (description ? iconMapOutlined : iconMapFilled)[type] || null;
    if (icon) {
      return replaceElement(icon, <span className={`${prefixCls}-icon`}>{icon}</span>, () => ({
        className: classNames(`${prefixCls}-icon`, {
          [(icon as any).props.className]: (icon as any).props.className,
        }),
      }));
    }

    return React.createElement(iconType, { className: `${prefixCls}-icon` });
  };

  const renderCloseIcon = () =>
    isClosable && (
      <button
        type="button"
        onClick={handleClose}
        className={`${prefixCls}-close-icon`}
        tabIndex={0}
      >
        {closeText ? (
          <span className={`${prefixCls}-close-text`}>{closeText}</span>
        ) : (
          <CloseOutlined />
        )}
      </button>
    );

  // banner 模式默认存在 icon
  const isShowIcon = banner && showIcon === undefined ? true : showIcon;

  const alertCls = classNames(
    prefixCls,
    `${prefixCls}-${type}`,
    {
      [`${prefixCls}-with-description`]: !!description,
      [`${prefixCls}-no-icon`]: !isShowIcon,
      [`${prefixCls}-banner`]: !!banner,
      [`${prefixCls}-closable`]: isClosable,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    className,
  );

  const dataOrAriaProps = getDataOrAriaProps(props);

  return (
    <CSSMotion>
      {({ className: motionClassName, style: motionStyle }) => (
        <div
          ref={ref}
          data-show={!closed}
          className={classNames(alertCls, motionClassName)}
          style={{ ...style, ...motionStyle }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
          role="alert"
          {...dataOrAriaProps}
        >
          {isShowIcon && renderIconNode()}
          <span className={`${prefixCls}-message`}>{message}</span>
          <span className={`${prefixCls}-description`}>{description}</span>
          {renderCloseIcon()}
        </div>
      )}
    </CSSMotion>
  );
};

Alert.ErrorBoundary = ErrorBoundary;

export default Alert;
