var snmp = require ("net-snmp");

function intervalFunc() {
    //MANAGER
var exc1;
var exc2;

var session1 = snmp.createSession ("10.175.214.7", "public");
var session2 = snmp.createSession ("10.175.214.8", "public");

var oids1 = ["1.3.6.1.4.1.25026.13.1.1.9.0"];
var oids2 = ["1.3.6.1.4.1.25026.13.1.1.9.0"];

session1.get (oids1, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++) {
            if (snmp.isVarbindError (varbinds[i])) {
                console.error (snmp.varbindError (varbinds[i]));
            } else {
                exc1 = varbinds[i].value
                console.log (exc1);
            }
        }
    }
    
});

session2.get (oids2, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++) {
            if (snmp.isVarbindError (varbinds[i])) {
                console.error (snmp.varbindError (varbinds[i]));
            } else {
                exc2 = varbinds[i].value
                console.log (exc2);
            }
        }
    } 
    
});

function max() {
    maxValue = Math.max(exc1, exc2);
    console.log("max", maxValue);
}

//AGENT
var options = {
    port: 161,
    disableAuthorization: true,
    accessControlModelType: snmp.AccessControlModelType.None,
    engineID: "8000B98380111111111111111111111111", // where the X's are random hex digits
    address: null,
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

function updateMib() {
    var mib = agent.getMib ();
    mib.registerProvider (myScalarProvider);
    mib.setScalarValue ("systemForwardPower", maxValue);
    mib.dump ();
}

function closeAll(){
    session1.close ();
    session2.close ();
    agent.close ()
}

setTimeout(max, 100);
setTimeout(updateMib, 150);
setTimeout(closeAll, 9500);
  }
  
setInterval(intervalFunc, 10000);






