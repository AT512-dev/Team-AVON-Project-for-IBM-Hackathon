'use strict';

const auditService = require('../services/auditService');

async function runAudit(req, res, next) {
  try {
    const { repoPath } = req.body;

    const result = await auditService.performAudit(repoPath);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { runAudit };
