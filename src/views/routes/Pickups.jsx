import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchQueue } from "state/reducers/queue/actions";
import PickupsTable from "views/components/PickupsTable";

const Pickups = props => {
    const { queueItems, fetchQueue } = props;

    useEffect(() => {
        fetchQueue();
        let refresh = setInterval(fetchQueue, 10000);

        return () => {
            clearInterval(refresh)
        }
    }, [fetchQueue]);


    return (
        <div className="pickups">
            <PickupsTable
                pickups={queueItems}
                onPickupDone={fetchQueue}
            />
        </div>
    );
};

const mapStateToProps = state => ({
    queueItems: state.queue.queueItems,
});

export default connect(mapStateToProps, {
    fetchQueue
})(Pickups);
