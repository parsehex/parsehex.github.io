import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Icon from '../Icon.vue';

describe('Icon.vue', () => {
  it('renders properly', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'brand-github',
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
