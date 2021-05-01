var snmp = require ("net-snmp");

//AGENT
var options = {
    port: 161,
    disableAuthorization: true,
    accessControlModelType: snmp.AccessControlModelType.None,
    engineID: "8000B98380111111111111111111111111", // where the X's are random hex digits
    address: "127.0.0.1",
    transport: "udp4"
};

var callback = function (error, data) {
    if ( error ) {
        console.error (error);
    } else {
        console.log (JSON.stringify(data, null, 2));
    }
};

agent = snmp.createAgent (options, callback);

var myScalarProvider = {
    name: "systemForwardPower",
    type: snmp.MibProviderType.Scalar,
    oid: "1.3.6.1.2.1.1.1",
    scalarType: snmp.ObjectType.Integer32,
    maxAccess: snmp.MaxAccess["read-write"],
    handler: function (mibRequest) {
       // e.g. can update the MIB data before responding to the request here
       mibRequest.done ();
    }
};
var mib = agent.getMib ();
mib.registerProvider (myScalarProvider);
mib.setScalarValue ("systemForwardPower", 3800);
mib.dump ();


