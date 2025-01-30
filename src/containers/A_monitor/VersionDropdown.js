import React from "react";
import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

const VersionDropdown = () => {
  const menu = (
    <Menu>
      <Menu.Item key="2.0">
        <a href="https://thornode.network" rel="noopener noreferrer">
          Version 2.0
        </a>
      </Menu.Item>

      <Menu.Item key="1.8">
        <a href="https://thornode.network/v1" rel="noopener noreferrer">
          Version 1.8
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button
        style={{
          backgroundColor: "#333",
          color: "#fff",
          border: "1px solid #666",
          marginLeft: 10,
        }}
      >
        Version 1.8 <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default VersionDropdown;
