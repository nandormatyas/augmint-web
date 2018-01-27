import React from 'react';

import { Grid } from "semantic-ui-react";

import { StableIcon, DecentralizedIcon, SecureIcon } from '../../../components/Icons';

export const keyFeatures = [
    {
        image: <StableIcon/>,
        title: 'Stable',
        text: 'With tokens pegged to their respective fiat, Augmint has low volatility and offers the stability typical crypotcurrencies lack.',
    },
    {
        image: <DecentralizedIcon/>,
        title: 'Decentralised',
        text: 'Augmint operates in an open and transparent way, free from government, institutions, or banks.',
    },
    {
        image: <SecureIcon/>,
        title: 'Secure',
        text: 'Built on blockchain technology, Augmint uses Etherum smart contracts that offer sophisticated cryptographic security.',
    }
];

export const keyBenefits = [
    {
        pk: 1,
        type: 'business',
        text: 'Offer your services in a variety of digital currencies',
    },
    {
        pk: 2,
        type: 'business',
        text: 'Keep prices simple by using a digital currency people can relate to',
    },
    {
        pk: 3,
        type: 'business',
        text: 'Lower costs and reduce time by avoiding financial institutions',
    },
    {
        pk: 4,
        type: 'individual',
        text: 'Move money between exchanges with peace of mind',
    },
    {
        pk: 5,
        type: 'individual',
        text: 'Spend your cryptocurrencies without losing from future earnings',
    },
    {
        pk: 6,
        type: 'individual',
        text: 'Utilise the blockchain with secure, decentralised way of spending',
    },
    
];
