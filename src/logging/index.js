var startTime = 0;
const DebugMode = false;

function Success(...args) {
  const currentTime = (new Date().getTime() - startTime);
  const data = args.join(" ");

  if(DebugMode) {
    let e = new Error();
    let frame = e.stack.split("\n")[2];
    var tracking = frame.split(" ")[5] + ":" + frame.split(":")[frame.split(":").length - 2];
    console.log(`\x1b[42m\x1b[37m[√ - ${currentTime} - ${tracking}]\x1b[0m\x1b[32m ${data}\x1b[0m`);
  } else console.log(`\x1b[42m\x1b[37m[√]\x1b[0m\x1b[32m ${data}\x1b[0m`);
}

function Info(...args) {
  const currentTime = new Date().getTime() - startTime;
  const data = args.join(" ");

  if(DebugMode) {
    let e = new Error();
    let frame = e.stack.split("\n")[2];
    var tracking = frame.split(" ")[5] + ":" + frame.split(":")[frame.split(":").length - 2];

    console.log(`\x1b[44m\x1b[37m[i - ${currentTime} - ${tracking}]\x1b[0m\x1b[36m ${data}\x1b[0m`);
  } else console.log(`\x1b[44m\x1b[37m[i]\x1b[0m\x1b[36m ${data}\x1b[0m`);
}

function Failure(...args) {
  const currentTime = new Date().getTime() - startTime;
  const data = args.join(" ");

  if(DebugMode) {
    let e = new Error();
    let frame = e.stack.split("\n")[2];
    var tracking = frame.split(" ")[5] + ":" + frame.split(":")[frame.split(":").length - 2];

    console.log(`\x1b[41m\x1b[37m[x - ${currentTime} - ${tracking}]\x1b[0m\x1b[31m ${data}\x1b[0m`);
  } else console.log(`\x1b[41m\x1b[37m[x]\x1b[0m\x1b[31m ${data}\x1b[0m`);
}

function ResetTiming() {
  startTime = new Date().getTime();
}

module.exports = {
  Info,
  Failure,
  Success,
  ResetTiming
};
