// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

/**
 * @title ValidationRegistry
 * @dev Core contract for storing validation proofs and results
 */
contract ValidationRegistry is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    
    struct ValidationProof {
        bytes32 dataHash;
        bytes32 proofHash;
        address validator;
        uint256 timestamp;
        string ruleSetId;
        bool isValid;
        string metadata;
    }
    
    struct RuleSet {
        string id;
        string name;
        string description;
        address creator;
        bool isActive;
        uint256 createdAt;
        mapping(string => string) parameters;
    }
    
    // Mappings
    mapping(bytes32 => ValidationProof) public validationProofs;
    mapping(string => RuleSet) public ruleSets;
    mapping(address => bool) public authorizedValidators;
    
    // Arrays for enumeration
    bytes32[] public proofHashes;
    string[] public ruleSetIds;
    
    // Events
    event ValidationSubmitted(
        bytes32 indexed proofHash,
        bytes32 indexed dataHash,
        address indexed validator,
        string ruleSetId,
        bool isValid
    );
    
    event RuleSetCreated(
        string indexed ruleSetId,
        string name,
        address indexed creator
    );
    
    event ValidatorAuthorized(address indexed validator, bool authorized);
    
    // Modifiers
    modifier onlyAuthorizedValidator() {
        require(authorizedValidators[msg.sender], "Not authorized validator");
        _;
    }
    
    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();
        
        // Authorize contract owner as initial validator
        authorizedValidators[msg.sender] = true;
    }
    
    /**
     * @dev Submit a validation proof
     */
    function submitValidation(
        bytes32 _dataHash,
        bytes32 _proofHash,
        string memory _ruleSetId,
        bool _isValid,
        string memory _metadata
    ) external onlyAuthorizedValidator nonReentrant {
        require(ruleSets[_ruleSetId].isActive, "RuleSet not active");
        require(validationProofs[_proofHash].timestamp == 0, "Proof already exists");
        
        ValidationProof memory proof = ValidationProof({
            dataHash: _dataHash,
            proofHash: _proofHash,
            validator: msg.sender,
            timestamp: block.timestamp,
            ruleSetId: _ruleSetId,
            isValid: _isValid,
            metadata: _metadata
        });
        
        validationProofs[_proofHash] = proof;
        proofHashes.push(_proofHash);
        
        emit ValidationSubmitted(_proofHash, _dataHash, msg.sender, _ruleSetId, _isValid);
    }
    
    /**
     * @dev Create a new rule set
     */
    function createRuleSet(
        string memory _id,
        string memory _name,
        string memory _description
    ) external {
        require(bytes(ruleSets[_id].id).length == 0, "RuleSet already exists");
        
        RuleSet storage ruleSet = ruleSets[_id];
        ruleSet.id = _id;
        ruleSet.name = _name;
        ruleSet.description = _description;
        ruleSet.creator = msg.sender;
        ruleSet.isActive = true;
        ruleSet.createdAt = block.timestamp;
        
        ruleSetIds.push(_id);
        
        emit RuleSetCreated(_id, _name, msg.sender);
    }
    
    /**
     * @dev Authorize or deauthorize a validator
     */
    function setValidatorAuthorization(address _validator, bool _authorized) external onlyOwner {
        authorizedValidators[_validator] = _authorized;
        emit ValidatorAuthorized(_validator, _authorized);
    }
    
    /**
     * @dev Get validation proof by hash
     */
    function getValidationProof(bytes32 _proofHash) external view returns (ValidationProof memory) {
        return validationProofs[_proofHash];
    }
    
    /**
     * @dev Get total number of proofs
     */
    function getProofCount() external view returns (uint256) {
        return proofHashes.length;
    }
    
    /**
     * @dev Get total number of rule sets
     */
    function getRuleSetCount() external view returns (uint256) {
        return ruleSetIds.length;
    }
}
