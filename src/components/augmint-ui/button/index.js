import React from "react";
import Icon from "../icon";

import { StyledLink, StyledA, StyledButton } from "./styles";

export default function Button(props) {
    const { children, to, type, content, icon } = props;

    let elementType = StyledA,
        _icon;

    if (type === "submit") {
        elementType = StyledButton;
    } else if (to) {
        elementType = StyledLink;
    }
    if (icon) {
        _icon = <Icon name={icon} />;
    }

    return React.createElement(elementType, props, children, content, _icon);
}
