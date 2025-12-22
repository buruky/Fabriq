import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Empty State Component
 * Displays friendly messages when there's no content
 */
const EmptyState = ({
  icon = '📦',
  title = 'Nothing here yet',
  message = 'Get started by adding your first item',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="text-7xl mb-6">{icon}</div>

      {/* Title */}
      <h3 className="text-2xl font-semibold text-neutral-text mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-gray-500 mb-8 max-w-md">
        {message}
      </p>

      {/* Action Button */}
      {(actionText && (actionLink || onAction)) && (
        actionLink ? (
          <Link
            to={actionLink}
            className="btn-primary"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="btn-primary"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
