// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * @title RuleSetManager
 * @dev Manages rule sets and their parameters for different validation types
 */
contract RuleSetManager is Initializable, OwnableUpgradeable {
    
    enum ValidationType {
        DEFI_KYC,
        DESCI_PLAGIARISM,
        DEPIN_SENSOR,
        WEB3_SOCIAL
    }
    
    struct RuleSetConfig {
        string id;
        string name;
        ValidationType validationType;
        bool isActive;
        uint256 createdAt;
        uint256 updatedAt;
        mapping(string => string) parameters;
        string[] parameterKeys;
    }
    
    mapping(string => RuleSetConfig) public ruleSetConfigs;
    mapping(ValidationType => string[]) public ruleSetsByType;
    string[] public allRuleSetIds;
    
    event RuleSetConfigCreated(
        string indexed ruleSetId,
        ValidationType indexed validationType,
        string name
    );
    
    event RuleSetConfigUpdated(
        string indexed ruleSetId,
        string parameter,
        string value
    );
    
    function initialize() public initializer {
        __Ownable_init(msg.sender);
        
        // Create default rule sets for each validation type
        _createDefaultRuleSets();
    }
    
    function createRuleSetConfig(
        string memory _id,
        string memory _name,
        ValidationType _validationType
    ) external onlyOwner {
        require(bytes(ruleSetConfigs[_id].id).length == 0, "RuleSet already exists");
        
        RuleSetConfig storage config = ruleSetConfigs[_id];
        config.id = _id;
        config.name = _name;
        config.validationType = _validationType;
        config.isActive = true;
        config.createdAt = block.timestamp;
        config.updatedAt = block.timestamp;
        
        allRuleSetIds.push(_id);
        ruleSetsByType[_validationType].push(_id);
        
        emit RuleSetConfigCreated(_id, _validationType, _name);
    }
    
    function setRuleSetParameter(
        string memory _ruleSetId,
        string memory _key,
        string memory _value
    ) external onlyOwner {
        require(bytes(ruleSetConfigs[_ruleSetId].id).length > 0, "RuleSet does not exist");
        
        RuleSetConfig storage config = ruleSetConfigs[_ruleSetId];
        
        // Add key to array if it doesn't exist
        bool keyExists = false;
        for (uint i = 0; i < config.parameterKeys.length; i++) {
            if (keccak256(bytes(config.parameterKeys[i])) == keccak256(bytes(_key))) {
                keyExists = true;
                break;
            }
        }
        
        if (!keyExists) {
            config.parameterKeys.push(_key);
        }
        
        config.parameters[_key] = _value;
        config.updatedAt = block.timestamp;
        
        emit RuleSetConfigUpdated(_ruleSetId, _key, _value);
    }
    
    function getRuleSetParameter(
        string memory _ruleSetId,
        string memory _key
    ) external view returns (string memory) {
        return ruleSetConfigs[_ruleSetId].parameters[_key];
    }
    
    function getRuleSetParameterKeys(
        string memory _ruleSetId
    ) external view returns (string[] memory) {
        return ruleSetConfigs[_ruleSetId].parameterKeys;
    }
    
    function getRuleSetsByType(
        ValidationType _validationType
    ) external view returns (string[] memory) {
        return ruleSetsByType[_validationType];
    }
    
    function _createDefaultRuleSets() internal {
        // DeFi KYC Rule Set
        _createDefaultRuleSet(
            "defi-kyc-v1",
            "DeFi KYC Validation",
            ValidationType.DEFI_KYC
        );
        
        // DeSci Plagiarism Rule Set
        _createDefaultRuleSet(
            "desci-plagiarism-v1",
            "DeSci Plagiarism Detection",
            ValidationType.DESCI_PLAGIARISM
        );
        
        // DePIN Sensor Rule Set
        _createDefaultRuleSet(
            "depin-sensor-v1",
            "DePIN Sensor Data Validation",
            ValidationType.DEPIN_SENSOR
        );
        
        // Web3 Social Rule Set
        _createDefaultRuleSet(
            "web3-social-v1",
            "Web3 Social Content Moderation",
            ValidationType.WEB3_SOCIAL
        );
    }
    
    function _createDefaultRuleSet(
        string memory _id,
        string memory _name,
        ValidationType _validationType
    ) internal {
        RuleSetConfig storage config = ruleSetConfigs[_id];
        config.id = _id;
        config.name = _name;
        config.validationType = _validationType;
        config.isActive = true;
        config.createdAt = block.timestamp;
        config.updatedAt = block.timestamp;
        
        allRuleSetIds.push(_id);
        ruleSetsByType[_validationType].push(_id);
        
        emit RuleSetConfigCreated(_id, _validationType, _name);
    }
}
