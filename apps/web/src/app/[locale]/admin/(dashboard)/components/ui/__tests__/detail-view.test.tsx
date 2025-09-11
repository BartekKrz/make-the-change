import { render, screen } from '@testing-library/react'
import { Package, DollarSign } from 'lucide-react'

import { DetailView } from '../detail-view'

describe('DetailView', () => {
  describe('DetailView Component', () => {
    it('renders with cards variant by default', () => {
      render(
        <DetailView>
          <div>Test content</div>
        </DetailView>
      )
      
      const container = screen.getByTestId('detail-view')
      expect(container).toHaveClass('grid')
    })

    it('renders with sections variant', () => {
      render(
        <DetailView variant="sections">
          <div>Test content</div>
        </DetailView>
      )
      
      const container = screen.getByTestId('detail-view')
      expect(container).toHaveClass('space-y-6')
      expect(container).not.toHaveClass('grid')
    })

    it('applies custom className', () => {
      render(
        <DetailView className="custom-class">
          <div>Test content</div>
        </DetailView>
      )
      
      const container = screen.getByTestId('detail-view')
      expect(container).toHaveClass('custom-class')
    })

    it('applies correct grid columns', () => {
      render(
        <DetailView gridCols={3} variant="cards">
          <div>Test content</div>
        </DetailView>
      )
      
      const container = screen.getByTestId('detail-view')
      expect(container).toHaveClass('xl:grid-cols-3')
    })
  })

  describe('DetailView.Section Component', () => {
    it('renders section with title and icon', () => {
      render(
        <DetailView.Section icon={Package} title="Test Section">
          <div>Section content</div>
        </DetailView.Section>
      )
      
      expect(screen.getByText('Test Section')).toBeInTheDocument()
      expect(screen.getByTestId('detail-section')).toBeInTheDocument()
    })

    it('applies span classes correctly', () => {
      render(
        <DetailView.Section span={2} title="Test">
          <div>Content</div>
        </DetailView.Section>
      )
      
      const section = screen.getByTestId('detail-section')
      expect(section).toHaveClass('lg:col-span-2')
    })

    it('shows loading indicator when loading', () => {
      render(
        <DetailView.Section loading title="Test">
          <div>Content</div>
        </DetailView.Section>
      )
      
      const loadingSpinner = document.querySelector('.animate-spin')
      expect(loadingSpinner).toBeInTheDocument()
    })

    it('renders without icon when not provided', () => {
      render(
        <DetailView.Section title="Test Section">
          <div>Section content</div>
        </DetailView.Section>
      )
      
      expect(screen.getByText('Test Section')).toBeInTheDocument()
      // Should not have icon container
      const iconContainer = document.querySelector('.p-2.bg-gradient-to-br')
      expect(iconContainer).not.toBeInTheDocument()
    })
  })

  describe('DetailView.Field Component', () => {
    it('renders field with label', () => {
      render(
        <DetailView.Field label="Test Field">
          <input type="text" />
        </DetailView.Field>
      )
      
      expect(screen.getByText('Test Field')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('shows required indicator when required', () => {
      render(
        <DetailView.Field required label="Required Field">
          <input type="text" />
        </DetailView.Field>
      )
      
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('displays description when provided', () => {
      render(
        <DetailView.Field description="Field description" label="Field">
          <input type="text" />
        </DetailView.Field>
      )
      
      expect(screen.getByText('Field description')).toBeInTheDocument()
    })

    it('displays error message when error provided', () => {
      render(
        <DetailView.Field error="Field error" label="Field">
          <input type="text" />
        </DetailView.Field>
      )
      
      expect(screen.getByText('Field error')).toBeInTheDocument()
      expect(screen.getByText('⚠️')).toBeInTheDocument()
    })

    it('shows loading indicator when loading', () => {
      render(
        <DetailView.Field loading label="Field">
          <input type="text" />
        </DetailView.Field>
      )
      
      const loadingSpinner = document.querySelector('.animate-spin')
      expect(loadingSpinner).toBeInTheDocument()
    })
  })

  describe('DetailView.FieldGroup Component', () => {
    it('renders field group with label', () => {
      render(
        <DetailView.FieldGroup label="Group Label">
          <div>Field 1</div>
          <div>Field 2</div>
        </DetailView.FieldGroup>
      )
      
      expect(screen.getByText('Group Label')).toBeInTheDocument()
    })

    it('applies correct layout classes', () => {
      render(
        <DetailView.FieldGroup layout="grid-2">
          <div>Field 1</div>
          <div>Field 2</div>
        </DetailView.FieldGroup>
      )
      
      const layoutContainer = document.querySelector(String.raw`.grid.grid-cols-1.sm\:grid-cols-2`)
      expect(layoutContainer).toBeInTheDocument()
    })

    it('displays description when provided', () => {
      render(
        <DetailView.FieldGroup description="Group description" label="Group">
          <div>Content</div>
        </DetailView.FieldGroup>
      )
      
      expect(screen.getByText('Group description')).toBeInTheDocument()
    })
  })

  describe('Integration Tests', () => {
    it('renders complete DetailView structure', () => {
      render(
        <DetailView variant="cards">
          <DetailView.Section icon={Package} title="General">
            <DetailView.Field required label="Name">
              <input defaultValue="Test Product" type="text" />
            </DetailView.Field>
            
            <DetailView.Field description="Product description" label="Description">
              <textarea defaultValue="Test description" />
            </DetailView.Field>
          </DetailView.Section>
          
          <DetailView.Section icon={DollarSign} span={2} title="Pricing">
            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label="Price">
                <input defaultValue="100" type="number" />
              </DetailView.Field>
              
              <DetailView.Field label="Stock">
                <input defaultValue="50" type="number" />
              </DetailView.Field>
            </DetailView.FieldGroup>
          </DetailView.Section>
        </DetailView>
      )
      
      // Check structure
      expect(screen.getByTestId('detail-view')).toHaveClass('grid')
      expect(screen.getByText('General')).toBeInTheDocument()
      expect(screen.getByText('Pricing')).toBeInTheDocument()
      
      // Check fields
      expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test description')).toBeInTheDocument()
      expect(screen.getByDisplayValue('100')).toBeInTheDocument()
      expect(screen.getByDisplayValue('50')).toBeInTheDocument()
      
      // Check required field
      expect(screen.getByText('*')).toBeInTheDocument()
      
      // Check span
      const pricingSection = screen.getByText('Pricing').closest('[data-testid="detail-section"]')
      expect(pricingSection).toHaveClass('lg:col-span-2')
    })
  })
})