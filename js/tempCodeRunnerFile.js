    let now = new Date();
    let hours = now.getHours().toString().padStart(2, "0");
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let amOrPm = hours >= 12 ? 'pm' : 'am';
    hours = (hours % 12) || 12;
    let time = `${hours}:${minutes} ${amOrPm}`;
    console.log(time)