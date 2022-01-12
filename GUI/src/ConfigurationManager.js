"use strict";

var configTable        = require("./ConfigTable.js").ConfigTable;


class ConfigurationManager
{
    /******* PRIVATE *******/
    #initStorage()
    {
        try
        {
            window.localStorage.getItem("blank");
            this.storage = window.localStorage;
        }
        catch (e)
        {
            console.log("ERROR: Storage init error");
        }

        if (!this.storage)
        {
            try
            {
                window.sessionStorage.getItem("blank");
                this.storage = window.sessionStorage;
            }
            catch (e)
            {
                console.log("ERROR: Session storage not available");
            }
        }
    }

    #readStorage(key)
    {
        if (this.storage)
        {
            return this.storage.getItem(storagePrefix + "#" + key);
        }
        else
        {
            return null;
        }
    }

    #writeStorage(key, value)
    {
        if (this.storage)
        {
            this.storage.setItem(storagePrefix + "#" + key, value);
        }
    }

    /******* PUBLIC *******/
    constructor(storagePrefix)
    {
        if (!ConfigurationManager.instance)
        {
            ConfigurationManager.instance = this;
            this.configMap = new Map();
            this.storagePrefix = storagePrefix;
            this.storage = undefined;

            // Initialize system storage
            initStorage();

            // Read parameters from storage.

        }
        return ConfigurationManager.instance;
    }

    static GetInstance()
    {
        return this.instance;
    }

    Get(key)
    {
        if (this.configMap.has(key))
        {
            return this.configMap.get(key);
        }
        else
        {
            console.log("ERROR: Requested nonexistent parameter: ", key);
            return null;
        }
    }

    Set(key, value)
    {
        if (this.configMap.has(key))
        {
            this.configMap.set(key, value);
            writeStorage(key, value);
        }
        else
        {
            console.log("ERROR: Requested nonexistent parameter: ", key);
        }

        if (storage)
        {
            storage.setItem(storagePrefix + "#" + key, value);
        }
    }
}

module.exports = {
    ConfigurationManager
};