import React from "react";
import { Panel } from "react-bootstrap";
import { MyListGroup, MyListGroupItem } from "components/MyListGroups";

export default class TransferList extends React.Component {
    render() {
        const {
            filter,
            header,
            noItemMessage,
            userAccountAddress
        } = this.props;
        const { transfers, isLoading } = this.props.transfers;
        const listItems =
            transfers !== null &&
            transfers.filter(filter).map((tx, index) =>
                <MyListGroupItem
                    key={`txDiv-${tx.blockNumber}-${tx.transactionIndex}-${tx.direction}`}
                >
                    {tx.from !== userAccountAddress &&
                        <p>
                            From: {tx.from}
                        </p>}
                    {tx.to !== userAccountAddress &&
                        <p>
                            To: {tx.to}
                        </p>}
                    <p>
                        Amount: {tx.amount} UCD
                    </p>
                    <p>
                        {tx.blockTimeStampText}
                    </p>
                    <small>
                        <p>
                            blockNumber: {tx.blockNumber} | transactionIndex:{" "}
                            {tx.transactionIndex} | type: {tx.type}
                        </p>
                    </small>
                </MyListGroupItem>
            );

        return (
            <Panel header={header}>
                {isLoading && <p>Refreshing transaction list...</p>}
                {transfers != null && listItems.length === 0
                    ? noItemMessage
                    : <MyListGroup>
                          {listItems}
                      </MyListGroup>}
            </Panel>
        );
    }
}

TransferList.defaultProps = {
    transfers: null,
    userAccountAddress: null,
    filter: () => {
        return true; // no filter passed
    },
    noItemMessage: <p>No transactions</p>,
    header: <h3>UCD transfer history</h3>
};
