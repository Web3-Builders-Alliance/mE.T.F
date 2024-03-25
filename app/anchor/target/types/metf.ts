export type Metf = {
  "version": "0.1.0",
  "name": "metf",
  "constants": [
    {
      "name": "CONFIG_SEED",
      "type": {
        "defined": "&'static[u8]"
      },
      "value": "b\"config\""
    }
  ],
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "MyError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "SomethingWentWrong"
          }
        ]
      }
    }
  ]
};

export const IDL: Metf = {
  "version": "0.1.0",
  "name": "metf",
  "constants": [
    {
      "name": "CONFIG_SEED",
      "type": {
        "defined": "&'static[u8]"
      },
      "value": "b\"config\""
    }
  ],
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "MyError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "SomethingWentWrong"
          }
        ]
      }
    }
  ]
};
