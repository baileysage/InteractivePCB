"use strict";


class Package_Pad
{
    constructor(iPCB_JSON_Pad)
    {
        this.pin1       = iPCB_JSON_Pad.pin1;
        this.type       = iPCB_JSON_Pad.type;
    }

    Render(isFront, location)
    {

    }

    IsSMD()
    {
        return (this.type == 'smd');
    }

    IsTHT()
    {
        return (this.type != 'smd');
    }

    IsPin1()
    {
        return this.pin1;
    }
}

module.exports = {
    Package_Pad
};
