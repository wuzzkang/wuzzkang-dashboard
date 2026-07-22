import React from 'react';

import { V2SectionWeddingCoupleForm } from './V2SectionWeddingCoupleForm';
import { V2SectionWeddingEventsForm } from './V2SectionWeddingEventsForm';
import { V2SectionDigitalGiftForm } from './V2SectionDigitalGiftForm';
import { V2SectionProductGridForm } from './V2SectionProductGridForm';
import {
  V2SectionWeddingHeroForm,
  V2SectionWeddingCountdownForm,
  V2SectionWeddingStoryForm,
  V2SectionWeddingGalleryForm,
  V2SectionWeddingWishesForm
} from './V2SectionWeddingForms';
import {
  V2SectionHeaderForm,
  V2SectionHeroForm,
  V2SectionAboutForm,
  V2SectionServicesForm,
  V2SectionSocialProofForm,
  V2SectionPricingForm,
  V2SectionFaqForm,
  V2SectionContactForm,
  V2SectionCustomForm,
  V2SectionStoreGuaranteeForm,
  V2SectionCourseCurriculumForm,
  V2SectionCourseMentorForm
} from './V2SectionStandardForms';

export default function V2SectionFormDispatcher({
  section,
  v2Sections,
  v2BrandName,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button,
  session,
  handleDeleteImage,
  handleUploadImage
}) {
  if (!section) return null;

  switch (section.type) {
    case 'header':
      return (
        <V2SectionHeaderForm
          section={section}
          v2Sections={v2Sections}
          v2BrandName={v2BrandName}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          session={session}
          handleDeleteImage={handleDeleteImage}
          handleUploadImage={handleUploadImage}
        />
      );

    case 'hero':
      return (
        <V2SectionHeroForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
          session={session}
          handleDeleteImage={handleDeleteImage}
          handleUploadImage={handleUploadImage}
        />
      );

    case 'about':
      return (
        <V2SectionAboutForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'services':
      return (
        <V2SectionServicesForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'social_proof':
      return (
        <V2SectionSocialProofForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'pricing':
      return (
        <V2SectionPricingForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'faq':
      return (
        <V2SectionFaqForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'wedding_hero':
      return (
        <V2SectionWeddingHeroForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'wedding_couple':
      return (
        <V2SectionWeddingCoupleForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
          session={session}
          handleDeleteImage={handleDeleteImage}
          handleUploadImage={handleUploadImage}
        />
      );

    case 'wedding_countdown':
      return (
        <V2SectionWeddingCountdownForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'wedding_events':
      return (
        <V2SectionWeddingEventsForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'wedding_story':
      return (
        <V2SectionWeddingStoryForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'wedding_gallery':
      return (
        <V2SectionWeddingGalleryForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'digital_gift':
      return (
        <V2SectionDigitalGiftForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'wedding_wishes':
      return (
        <V2SectionWeddingWishesForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'product_grid':
      return (
        <V2SectionProductGridForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'store_guarantee':
      return (
        <V2SectionStoreGuaranteeForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'course_curriculum':
      return (
        <V2SectionCourseCurriculumForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'course_mentor':
      return (
        <V2SectionCourseMentorForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'contact':
      return (
        <V2SectionContactForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );

    case 'custom':
    default:
      return (
        <V2SectionCustomForm
          section={section}
          handleUpdateSectionContent={handleUpdateSectionContent}
          renderSectionStylePicker={renderSectionStylePicker}
          renderAIV2Button={renderAIV2Button}
        />
      );
  }
}
