"use strict";


class Package_Pad
{
    constructor(iPCB_JSON_Pad)
    {
        this.pad_type   = iPCB_JSON_Pad.pad_type;
        this.pin1       = iPCB_JSON_Pad.pin1;
        this.shape      = iPCB_JSON_Pad.shape;
    }

    Render(isFront, location)
    {

    }

    IsSMD()
    {
        return (this.pad_type == 'smd');
    }

    IsTHT()
    {
        return (this.pad_type == 'tht');
    }

    IsPin1()
    {
        return this.pin1;
    }
}

module.exports = {
    Package_Pad
};
