import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardFooter from '../CardFooter.vue';

describe('CardFooter.vue', () => {
  const mockRepo = {
    name: 'test-repo',
    full_name: 'owner/test-repo',
    html_url: 'https://github.com/owner/test-repo',
    description: 'A test repo',
    stargazers_count: 10,
    forks_count: 5,
    topics: ['vue', 'vitest'],
    language: 'TypeScript',
  };

  const mockReadmeManifest = [];

  it('renders "Learn more" link when project page exists', () => {
    const wrapper = mount(CardFooter, {
      props: {
        repo: mockRepo,
        readmeManifest: mockReadmeManifest,
        view: 'grid',
      },
      global: {
        provide: {
          projectPages: ['test-repo'],
        },
      },
    });

    const link = wrapper.find('a[href="/projects/test-repo"]');
    expect(link.exists()).toBe(true);
    expect(link.text()).toBe('Learn more');
  });

  it('does not render "Learn more" link when project page does not exist', () => {
    const wrapper = mount(CardFooter, {
      props: {
        repo: mockRepo,
        readmeManifest: mockReadmeManifest,
        view: 'grid',
      },
      global: {
        provide: {
          projectPages: ['other-repo'],
        },
      },
    });

    const link = wrapper.find('a[title="View Project Page"]');
    expect(link.exists()).toBe(false);
  });
});
