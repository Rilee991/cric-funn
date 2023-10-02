import React, { useContext, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Spin } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';

import Shortcuts from './Shortcuts';
import Popup from '../../../components/common/Popup';
import UserControlTable from './UserControlTable';
import { ContextProvider } from '../../../global/Context';

const ControlPanel = () => {
    const contextConsumer = useContext(ContextProvider);
    const { getPointsTableData, resetUserDetails, syncUserDetails, loggedInUserDetails, configurations, setConfigurations } = contextConsumer;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [tip, setTip] = useState("loading");
    const [severity, setSeverity] = useState("error");
    const [pointsTableDetails, setPointsTableDetails] = useState({});

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        setMessage("");
    }

    useEffect(() => {
        getPageDetails();
    },[])

    const getPageDetails = async () => {
        setLoading(true);
        try {
            setTip("Fetching points table data...");
            const pointsTableDetails = await getPointsTableData();
            setPointsTableDetails(pointsTableDetails);
        } catch (e) {
            console.log(e);
            setSeverity("error");
            setMessage(e);
        }
        setLoading(false);
    }

    return (
        <Spin spinning={loading} tip={tip} indicator={<Loading3QuartersOutlined spin style={{ fontSize: 28, color: "#3f067a" }} />} style={{ color: "#3f067a", textTransform: "capitalize" }}>
            <Shortcuts setLoading={setLoading} configurations={configurations} setConfigurations={setConfigurations} loggedInUserDetails={loggedInUserDetails} setMessage={setMessage} setTip={setTip} setSeverity={setSeverity} />
            <UserControlTable
                tableDetails={{ ...pointsTableDetails, title: "User Controls" }}
                resetUserDetails={resetUserDetails}
                setLoading={setLoading} setMessage={setMessage} setTip={setTip} setSeverity={setSeverity}
                syncUserDetails={syncUserDetails}
            />
            <Popup isOpen={!isEmpty(message)} duration={5000} handleClose={handleClose}
                position={{ vertical: "top", horizontal: "right" }} severity={severity}
            >
                {message}
            </Popup>
        </Spin>
    );
}

export default ControlPanel;
